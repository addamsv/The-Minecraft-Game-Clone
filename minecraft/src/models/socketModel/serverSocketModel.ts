import ServerSocketModelInterface from './ServerSocketModelInterface';
import env from '../../configs/environmentVars';
import MainControllerInterface from '../../controllers/mainControllerInterface';
import ChatViewInterface from '../../views/chatView/chatViewInterface';

class ServerSocketModel implements ServerSocketModelInterface {
  private controller: MainControllerInterface;

  private USER_NAME: String;

  private ws: WebSocket;

  private USER_TOKEN: String;

  private WS_TOKEN: string;

  private USER_AMOUNT: String;

  private HOST: string;

  private GAME_SEED: string;

  private isGameHost: boolean;

  private isConnected: boolean;

  private isRegistered: boolean;

  private playersTokens: Set<string>;

  private chatView: ChatViewInterface;

  private pingSetIntervalID: number;

  public playerMotion: any;

  constructor(controller: MainControllerInterface) {
    this.controller = controller;
    this.chatView = null;
    this.ws = null;
    this.WS_TOKEN = '';
    this.USER_NAME = '';
    this.USER_TOKEN = '';
    this.USER_AMOUNT = '';
    this.GAME_SEED = '';
    this.isGameHost = false;
    this.isConnected = false;
    this.isRegistered = false;
    this.playersTokens = new Set();
    this.pingSetIntervalID = null;
    this.HOST = env.socketHost;
    this.createConnection();
  }

  public isHandshaked() {
    return this.isConnected;
  }

  public sendMessage(textMessage: string, type: String) {
    switch (type) {
      case 'chatMessage': {
        this.send(`{"userName": "${this.USER_NAME}", "wsToken": "${this.WS_TOKEN}", "chatMessage": "${textMessage}"}`);
        break;
      }

      case 'stat': {
        this.send(0 + textMessage);
        break;
      }

      case 'setts': {
        this.send(0 + textMessage);
        break;
      }

      case 'logOut': {
        this.send(2 + textMessage);
        break;
      }

      case 'changePassword': {
        this.send(0 + textMessage);
        break;
      }

      case 'signUp': {
        this.send(0 + textMessage);
        break;
      }

      default: {
        break;
      }
    }
  }

  public logOut() {
    localStorage.removeItem('USER_TOKEN');
    this.sendMessage('{"ask": "logOut"}', 'logOut');
    this.playersTokens.clear();
  }

  public disconnect() {
    this.sendMessage('{"ask": "logOut"}', 'logOut');
    this.playersTokens.clear();
  }

  public signUp(login: any, password: any) {
    if (login && password) {
      this.sendMessage(`{"ask": "signUp", "login": "${login}", "password": "${password}"}`, 'signUp');
    }
  }

  public changePassword(newPassword: string) {
    this.sendMessage(`{"ask": "changePassword", "newPassword": "${newPassword}"}`, 'changePassword');
  }

  public init(login: any = '', pass: any = '') {
    if (this.ws) {
      this.login(login, pass);
    } else {
      this.createConnection();
      setTimeout(() => {
        if (this.isConnected) {
          this.login(login, pass);
        }
      }, 3000);
    }
  }

  public setSeed(seed: string) {
    this.GAME_SEED = seed;
  }

  public getSeed() {
    return this.GAME_SEED;
  }

  /**
   * @param x: String - X coordinate
   * @param z: String - Z coordinate
   * @param y: String - Y coordinate
   * @param c: String - Camera Angle
   * number 1 before object in sendCoordinates is code for server
  */
  public sendCoordinates(x: String, z: String, y: String, c: String) {
    this.send(`1{"gameMessage": "${this.WS_TOKEN}", "x": "${x}", "z": "${z}", "y": "${y}", "c": "${c}"}`);
  }

  /*
  *   @private
  */
  private createConnection() {
    this.ws = new WebSocket(this.HOST);
    this.ws.onopen = this.connectionOpen.bind(this);
    this.ws.onmessage = this.messageReceived.bind(this);
    this.ws.onerror = this.connectionError.bind(this);
    this.ws.onclose = this.connectionClose.bind(this);
  }

  private send(message: string) {
    if (this.ws && this.isConnected && this.ws.readyState === 1) {
      this.ws.send(message);
    }
  }

  private sendSeed() {
    this.send(`{"setSeed": "${this.GAME_SEED}"}`);
  }

  private messageReceived(message: any) {
    const mess = JSON.parse(message.data);
    if (mess.logOutMessage) {
      this.isRegistered = false;
      this.isGameHost = false;
      this.ws.close();
      console.log('the User is logged out: true');
    }

    if (mess.mesChangePassword) {
      const event = new CustomEvent('mess', { detail: { mess: mess.mesChangePassword } });
      this.serverMenuIdEvent(event);
    }

    if (mess.setUserAsRegistered) {
      this.isRegistered = true;
      this.sendMessage('{"ask": "setSetts"}', 'setts');
      this.sendMessage('{"ask": "getSetts"}', 'setts');
      console.log('User is Registered: true');
    }

    if (mess.setWsToken) {
      this.WS_TOKEN = mess.setWsToken;
      console.log(`this.WS_TOKEN: ${this.WS_TOKEN}`);
    }

    if (mess.setToken) {
      this.isRegistered = true;
      const event = new CustomEvent('success', { detail: { login: mess.login } });
      this.serverMenuIdEvent(event);
      localStorage.setItem('USER_TOKEN', mess.setToken);
      this.USER_TOKEN = mess.setToken;
      console.log(`this.USER_TOKEN: ${this.USER_TOKEN}`);
    }

    if (mess.failLogin) {
      this.isRegistered = false;
      this.isGameHost = false;
      this.dispatchCustomFailEvent(mess.failLogin);
    }

    if (mess.failChangePassword) {
      this.dispatchCustomFailEvent(mess.failChangePassword);
    }

    if (mess.failLogOut) {
      this.dispatchCustomFailEvent(mess.failLogOut);
    }

    if (mess.failSignIn) {
      this.dispatchCustomFailEvent(mess.failSignIn);
    }

    if (mess.mesSignIn) {
      const event = new CustomEvent('mess', { detail: { mess: mess.mesSignIn } });
      this.serverMenuIdEvent(event);
    }

    /*
    * Connect new Player to GameModel
    */
    if (mess.setNewWsToken) { // && this.controller.isServerGameStart
      const tokens: Array<string> = mess.setNewWsToken.split('___');
      tokens.forEach((playerToken: string) => {
        if (!this.playersTokens.has(playerToken) && playerToken !== this.WS_TOKEN) {
          console.log(`${mess.setNewWsToken} ${playerToken}`);
          this.playersTokens.add(playerToken);
          this.playerMotion.connectPlayer(playerToken);
        }
      });
    }

    /**
     * Dispatch event for remote disconnected player
     *  retrieve player token
     */
    if (mess.gameDisconnectedMessage) {
      if (
        this.playersTokens.has(mess.gameDisconnectedMessage)
        // && mess.gameDisconnectedMessage !== this.WS_TOKEN
      ) {
        console.log(`disconnectPlayer: ${mess.gameDisconnectedMessage}`);
        this.playersTokens.delete(mess.gameDisconnectedMessage);
        this.playerMotion.disconnectPlayer(mess.gameDisconnectedMessage);
      }
    }

    /*
    * Check amount of connected Players
    */
    if (mess.setUserMount && this.isRegistered) {
      this.USER_AMOUNT = mess.setUserMount;

      // Start game for HOST
      // if (this.USER_AMOUNT === '1') {
      //   this.setSeed(Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1));
      //   this.isGameHost = true;
      //   this.startGame();
      // }
      // this.sendSeed();
    }

    if (mess.setHost && this.isRegistered) {
      this.isGameHost = mess.setHost === 'host';
      console.log(`isHost: ${mess.setHost === 'host'}`);
    }

    /*
    * Start game for CONNECTED
    */
    if (mess.setSeed && this.isRegistered) { // && !this.isGameHost
      this.GAME_SEED = mess.setSeed;
      console.log(`mess.setSeed: ${mess.setSeed}`);
      this.startGame();
    }

    if (mess.setUserName) {
      this.USER_NAME = mess.setUserName;
      console.log(`this.USER_NAME: ${this.USER_NAME}`);
    }

    /*
    * Dispatch event with player coordinates to GameModel
    */
    if (mess.gameMessage) {
      this.playerMotion.movePlayer({
        token: mess.gameMessage, x: mess.x, z: mess.z, y: mess.y, c: mess.c,
      });
    }

    /*
    *  Chat messages
    */
    if (mess.chatMessage) {
      console.log(mess.chatMessage);
      this.chatView.appendMessage(
        mess.userName,
        mess.chatMessage,
        this.areYouMessageOwner(mess.wsToken),
      );
    }
    if (mess.chatServerMessage && this.controller.isServerGameStart) {
      console.log(mess.chatServerMessage);
      this.chatView.appendMessage('SERVER', mess.chatServerMessage, false);
    }
  }

  // eslint-disable-next-line
  private dispatchCustomFailEvent(event: any) {
    this.serverMenuIdEvent(new CustomEvent('fail', { detail: { fail: event } }));
  }

  // eslint-disable-next-line class-methods-use-this
  private serverMenuIdEvent(event: any) {
    document.dispatchEvent(event);
  }

  // eslint-disable-next-line
  private startGame() {
    this.controller.startServerGame();
  }

  private areYouMessageOwner(curWsToken: String) {
    if (curWsToken === undefined || this.WS_TOKEN === undefined) {
      return false;
    }
    return this.WS_TOKEN === curWsToken;
  }

  private connectionOpen() {
    this.isConnected = true;
    this.chatView = this.controller.getChatView();
    this.ping();
  }

  private connectionError() {
    this.isConnected = false;
    if (this.chatView) {
      this.chatView.appendSysMessage('connection Error');
    }
  }

  private connectionClose() {
    this.isConnected = false;
    clearInterval(this.pingSetIntervalID);
    if (this.chatView) {
      this.chatView.appendSysMessage('connection closed');
    }
    setTimeout(() => this.createConnection(), 5000);
  }

  private login(login: any, password: any) {
    if (login && password) {
      this.loginThroughPass(login, password);
      return;
    }
    const USER_TOKEN = localStorage.getItem('USER_TOKEN');
    if (USER_TOKEN) {
      this.loginThroughToken(USER_TOKEN);
    }
  }

  private loginThroughPass(login: any, password: any) {
    this.send(`0{"ask": "loginThroughPass", "login": "${login}", "password": "${password}"}`);
  }

  private loginThroughToken(token: any) {
    if (token) {
      this.send(`0{"ask": "register", "userToken": "${token}"}`);
    } else {
      console.log('User token has not been defined');
    }
  }

  private ping() {
    this.pingSetIntervalID = window.setInterval(() => this.send('3'), 30000);
  }
}

export { ServerSocketModelInterface, ServerSocketModel };
