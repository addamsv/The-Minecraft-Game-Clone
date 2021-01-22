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

  private playersTokens: Set<string>;

  private chatView: ChatViewInterface;

  constructor(controller: MainControllerInterface, userToken = '') {
    this.controller = controller;
    this.chatView = null;
    this.ws = null;
    this.WS_TOKEN = '';
    this.USER_NAME = '';
    this.USER_TOKEN = userToken;
    this.USER_AMOUNT = '';
    this.GAME_SEED = '';
    this.isGameHost = false;
    this.isConnected = false;
    this.playersTokens = new Set();

    this.HOST = env.socketHost;
  }

  public isHandshaked() {
    return this.isConnected;
  }

  public sendMessage(textMessage: string, type: String) {
    switch (type) {
      case 'chatMessage':
        this.ws.send(`{"userName": "${this.USER_NAME}", "wsToken": "${this.WS_TOKEN}", "chatMessage": "${textMessage}"}`);
        break;
      case 'gameMessage': break;
      case 'sysMessage': break;
      default: break;
    }
  }

  public init() {
    document.cookie = `X-Authorization=${this.USER_TOKEN}; path=/`;

    this.ws = new WebSocket(this.HOST);
    this.ws.onopen = this.connectionOpen.bind(this);
    this.ws.onmessage = this.messageReceived.bind(this);
    this.ws.onerror = this.connectionError.bind(this);
    this.ws.onclose = this.connectionClose.bind(this);
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
    this.ws.send(`1{"gameMessage": "${this.WS_TOKEN}", "x": "${x}", "z": "${z}", "y": "${y}", "c": "${c}"}`);
  }

  /*
  *   @private
  */

  private sendSeed() {
    this.ws.send(`{"setSeed": "${this.GAME_SEED}"}`);
  }

  private messageReceived(message: any) {
    const mess = JSON.parse(message.data);
    if (mess.setWsToken) {
      this.WS_TOKEN = mess.setWsToken;
      console.log(`this.WS_TOKEN: ${this.WS_TOKEN}`);
    }

    // Connect new Player to GameModel
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

    // Check amount of connected Players
    if (mess.setUserMount) {
      if (this.USER_TOKEN) {
        this.ws.send(`0{"ask": "register", "userToken": "${this.USER_TOKEN}"}`);
      } else {
        console.log('User token has not been defined');
      }

      this.isConnected = true;
      this.USER_AMOUNT = mess.setUserMount;

      // Start game for HOST
      if (this.USER_AMOUNT === '1') {
        this.setSeed(Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1));
        this.isGameHost = true;
        this.startGame();
      }
      this.sendSeed();
    }

    // Start game for CONNECTED
    if (mess.setSeed && !this.isGameHost) {
      this.GAME_SEED = mess.setSeed;
      this.startGame();
    }

    if (mess.setUserName) {
      this.USER_NAME = mess.setUserName;
      console.log(`this.WS_TOKEN: ${this.USER_NAME}`);
    }

    // Dispatch event with player coordinates to GameModel
    if (mess.gameMessage) {
      const event = new CustomEvent('moveplayer', {
        detail: {
          token: mess.gameMessage, x: mess.x, z: mess.z, y: mess.y, c: mess.c,
        },
      });
      document.body.dispatchEvent(event);
    }

    // Chat messages
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
    // this.ws.send(`{"userToken": "${this.USER_TOKEN}"}`);
    this.chatView = this.controller.getChatView();
  }

  private connectionError() {
    this.chatView.appendSysMessage('connection Error');
  }

  private connectionClose() {
    this.ws.close();
    this.chatView.appendSysMessage('connection closed');
  }
}

export { ServerSocketModelInterface, ServerSocketModel };
