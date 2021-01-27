import ServerSocketModelInterface from './ServerSocketModelInterface';
import env from '../../configs/environmentVars';
import MainControllerInterface from '../../controllers/mainControllerInterface';
import ChatViewInterface from '../../views/chatView/chatViewInterface';

class ServerSocketModel implements ServerSocketModelInterface {
  private controller: MainControllerInterface;

  private USER_NAME: String;

  private ws: WebSocket;

  private USER_TOKEN: String;

  private WS_TOKEN: String;

  private USER_AMOUNT: String;

  private HOST: string;

  private GAME_SEED: string;

  private isGameHost: boolean;

  private isConnected: boolean;

  private isRegistered: boolean;

  private playersTokens: Set<string>;

  private chatView: ChatViewInterface;

  private pingSetIntervalID: number;

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

      default: {
        break;
      }
    }
  }

  public logOut() {
    localStorage.removeItem('USER_TOKEN');
    this.sendMessage('{"ask": "logOut"}', 'logOut');
  }

  public init(login: any = '', pass: any = '') {
    if (this.ws) {
      this.login(login, pass);
    } else {
      this.createConnection();
      setTimeout(() => {
        if (this.isConnected) {
          this.login(login, pass);
          console.log(login);
          console.log(this.ws);
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
      this.ws.close();
      console.log('the User is logged out: true');
    }

    if (mess.setUserAsRegistered) {
      this.isRegistered = true;
      this.sendMessage('{"ask": "getSetts"}', 'setts');
      this.sendMessage('{"ask": "getStat"}', 'stat');
      console.log('User is Registered: true');
    }

    if (mess.setWsToken) {
      this.WS_TOKEN = mess.setWsToken;
      console.log(`this.WS_TOKEN: ${this.WS_TOKEN}`);
    }

    if (mess.setToken) {
      this.isRegistered = true;
      const event = new CustomEvent('success', { detail: { login: mess.login } });
      document.getElementById('server-menu-id').dispatchEvent(event);
      /*
      * Here should add token to storage
       */
      localStorage.setItem('USER_TOKEN', mess.setToken);
      this.USER_TOKEN = mess.setToken;
      console.log(`this.USER_TOKEN: ${this.USER_TOKEN}`);
    }

    if (mess.failLogin) {
      console.log(mess.failLogin);
      this.isRegistered = false;
      const event = new CustomEvent('fail', { detail: { fail: mess.failLogin } });
      // const event = new CustomEvent('fail');
      document.getElementById('server-menu-id').dispatchEvent(event);
    }

    /*
    * Connect new Player to GameModel
    */
    if (mess.setNewWsToken) {
      const tokens: Array<string> = mess.setNewWsToken.split('___');
      tokens.forEach((playerToken: string) => {
        if (!this.playersTokens.has(playerToken) && playerToken !== this.WS_TOKEN) {
          this.playersTokens.add(playerToken);
          const event = new CustomEvent('connectplayer', { detail: { token: playerToken } });
          document.body.dispatchEvent(event);
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
        && mess.gameDisconnectedMessage !== this.WS_TOKEN
      ) {
        this.playersTokens.delete(mess.gameDisconnectedMessage);
        const event = new CustomEvent('disconnectplayer', { detail: { token: mess.gameDisconnectedMessage } });
        document.body.dispatchEvent(event);
      }
    }

    /*
    * Check amount of connected Players
    */
    if (mess.setUserMount && this.isRegistered) {
      this.USER_AMOUNT = mess.setUserMount;

      // Start game for HOST
      if (this.USER_AMOUNT === '1') {
        this.setSeed(Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1));
        this.isGameHost = true;
        this.startGame();
      }
      this.sendSeed();
    }

    /*
    * Start game for CONNECTED
    */
    if (mess.setSeed && !this.isGameHost && this.isRegistered) {
      this.GAME_SEED = mess.setSeed;
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
      const event = new CustomEvent('moveplayer', {
        detail: {
          token: mess.gameMessage, x: mess.x, z: mess.z, y: mess.y, c: mess.c,
        },
      });
      document.body.dispatchEvent(event);
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
    if (mess.chatServerMessage) {
      console.log(mess.chatServerMessage);
      this.chatView.appendMessage('SERVER', mess.chatServerMessage, false);
    }
  }

  // eslint-disable-next-line
  private startGame() {
    const event = new CustomEvent('startservergame');
    document.body.dispatchEvent(event);
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
