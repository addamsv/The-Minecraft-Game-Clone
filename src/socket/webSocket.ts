import { Server } from 'ws';
import * as http from 'http';
import * as jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import appConfig from '../../app-config';
import Persistence from '../model/postgreModel';
import getUUID from '../utils/getUUID';

interface IPayload extends Object {
  id: string;
  login: String;
  password: String;
}

interface IWebSocketServer extends Server {
  id: string;
  userName: string;
  token: string;
  isRegistered: boolean;
  isHost: string;
  seed: string;
  userTimeValue: string;
  userTimeStart: number;
  // eslint-disable-next-line no-unused-vars
  send: (mess: string) => void;
}

interface IUserMessage {
  userToken: string;
  login: string;
  password: string;
  newPassword: string;
}

// interface IWebsocketData {

// }

export default class MinecraftWebSocket {
  public wssInit(server: http.Server) {
    const wss: Server = new Server({
      server,
      perMessageDeflate: false,
    });

    wss.on('connection', (wsConnection: IWebSocketServer) => {
      wsConnection.on('close', () => {
        console.log(
          wsConnection.id,
          Number(wsConnection.userTimeValue) + Date.now() - wsConnection.userTimeStart,
        );

        Persistence.saveUserScore(
          wsConnection.id,
          String(
            Number(wsConnection.userTimeValue) + Date.now() - wsConnection.userTimeStart,
          ),
        );

        console.log(`${wsConnection.token || 'guest\'s'} connection closed`);

        this.sendToEveryRegistered(
          wss.clients,
          `{"gameDisconnectedMessage": "${wsConnection.token}", "chatServerMessage": "the user ${wsConnection.userName} has disconnected  (connected: ${wss.clients.size})"}`,
        );
      });

      wsConnection.on('message', (websocketData: string) => {
        if (websocketData[0] !== '{') {
          this.onMessageWithCode(wss, wsConnection, websocketData);
          return;
        }

        this.sendToEveryone(wss.clients, websocketData);
      });
    });
  }

  private onMessageWithCode(
    wss: Server,
    currSocketConnection: IWebSocketServer,
    websocketData: string,
  ) {
    const websocket = currSocketConnection;

    const newWebsocketData = websocketData.substr(1);

    switch (websocketData[0]) {
      case '0': {
        try {
          const mess = JSON.parse(newWebsocketData);

          switch (mess.ask) {
            case 'signUp': {
              this.signUp(wss, mess, websocket);
              break;
            }

            case 'register': {
              this.login(wss, mess, websocket);
              break;
            }

            case 'loginThroughPass': {
              this.loginThroughPass(wss, mess, websocket);
              break;
            }

            case 'changePassword': {
              if (websocket.isRegistered) {
                this.changePassword(wss, websocket, mess);
              }
              break;
            }

            case 'setStat':
            case 'getStat':
            case 'setSetts': {
              if (websocket.isRegistered) {
                console.log(mess);
              }
              break;
            }

            default: break;
          }
        } catch {
          console.log('Object in socket message has not JSON type:', newWebsocketData);
        }
        break;
      }

      case '1': {
        this.sendToAllButNotYou(websocket, wss.clients, newWebsocketData);
        break;
      }

      case '2': {
        if (websocket.isRegistered) {
          this.logOut(wss, websocket);
        }

        break;
      }

      case '3': {
        /** here should locate statistics code ('ping') */
        break;
      }

      default: break;
    }
  }

  private onRegisterCommon(wss: Server, ws: IWebSocketServer, userName: string) {
    const websocket = ws;

    websocket.isRegistered = true;

    /** If you use your own domain name: req.headers['sec-websocket-key']; */
    websocket.token = this.getUserID(wss.clients);
    websocket.userName = userName;

    const amountRegisteredUsers = this.getAmountOfRegisteredUsers(wss.clients);

    websocket.isHost = this.isHost(amountRegisteredUsers, wss);
    websocket.seed = this.getSeed(amountRegisteredUsers, wss.clients);

    console.log(`seed: ${websocket.seed}, isHost: ${websocket.isHost}`);

    this.sendOnlyToYou(websocket, `{"setUserAsRegistered": "true", "setHost": "${websocket.isHost}", "setSeed": "${websocket.seed}", "setUserMount": "${amountRegisteredUsers}", "setWsToken": "${websocket.token}", "setUserName": "${userName}", "chatServerMessage": "You are connected  (connected: ${amountRegisteredUsers})"}`);
    this.sendToAllButNotYou(websocket, wss.clients, `{"setUserMount": "${amountRegisteredUsers}", "chatServerMessage": "User has connected (connected: ${amountRegisteredUsers})"}`);
    this.sendToEveryRegistered(wss.clients, `{"setNewWsToken": "${this.getWSTokensString(wss.clients)}"}`);
  }

  private async signUp(wss, mess: IUserMessage, ws: IWebSocketServer) {
    const websocket = ws;

    const items = await Persistence.getByLogin(mess.login);

    if (items || mess.login || mess.password) {
      websocket.send('{"failSignIn": "userIsAlreadyRegistered"}');
      return;
    }

    const player = { login: mess.login, password: mess.password, id: uuid() };

    const newPlayer = await Persistence.create(player);

    if (!newPlayer) {
      websocket.send('{"failSignIn": "wasWrongBD"}');
      console.log('Password was not registered: something was wrong with BD');
      return;
    }

    websocket.send(`{"mesSignIn": "signed", "login": "${player.login}"}`);
    console.log('user was signed-Up');
  }

  private async changePassword(wss, ws: IWebSocketServer, mess: IUserMessage) {
    const websocket = ws;

    if (!mess.newPassword) {
      return;
    }

    const item = await Persistence.updatePassword(websocket.id, mess.newPassword);

    if (!item) {
      websocket.send('{"failChangePassword": "wasWrongBD"}');
      console.log('Password was not unregistered: something was wrong with BD');
      return;
    }

    websocket.send('{"mesChangePassword": "passChanged"}');
    console.log('Password was successfully changed');
  }

  private async setPlayerTimeValue(ws: IWebSocketServer) {
    const websocket = ws;

    const item = await Persistence.getUserScore(websocket.id);

    websocket.userTimeValue = item.player_values || 0;
    websocket.userTimeStart = Date.now();
  }

  private async logOut(wss, ws: IWebSocketServer) {
    const websocket = ws;

    const item = await Persistence.logOutById(websocket.id);

    if (!item) {
      websocket.send('{"failLogOut": "wasWrongBD"}');

      console.log('user was not unregistered: something was wrong with BD');
      return;
    }

    websocket.isRegistered = false;
    websocket.send('{"logOutMessage": "logOut"}');
    websocket.send(`{"chatServerMessage": "you are unregistered as ${websocket.userName}!"}`);

    console.log('user was successfully unregistered');
  }

  private login(wss: Server, mess: IUserMessage, ws: IWebSocketServer) {
    const websocket = ws;

    jwt.verify(
      mess.userToken,
      appConfig.TOKEN_KEY,
      async (err, payload: IPayload) => {
        if (err) {
          websocket.send('{"failLogin": "wrongOrExpiredToken"}');
        }

        if (payload) {
          const item = await Persistence.getById(payload.id);

          if (item) {
            if (!this.isUserAlreadyRegistered(wss.clients, payload.id)) {
              this.onRegisterCommon(wss, ws, payload.login.toString());
              websocket.id = payload.id;
              this.setPlayerTimeValue(ws);

              const token = jwt.sign({ id: payload.id, login: payload.login }, appConfig.TOKEN_KEY, { expiresIn: '30d' });

              websocket.send(`{"chatServerMessage": "you are registered as ${payload.login}!", "login": "${payload.login}", "setToken": "${token}"}`);

              console.log('user was registered through token');
            } else {
              websocket.send('{"failLogin": "userIsAlreadyRegistered"}');
            }
          } else {
            websocket.send('{"failLogin": "loginNoExist"}');
          }
        }
      },
    );
  }

  private async loginThroughPass(wss: Server, mess: IUserMessage, ws: IWebSocketServer) {
    const websocket = ws;

    if (mess.login && mess.password) {
      const item = await Persistence.getByLogin(mess.login);

      if (item) {
        if (item.login === mess.login && item.password === mess.password) {
          const { id } = item;

          const { login } = item;

          if (!this.isUserAlreadyRegistered(wss.clients, id)) {
            this.onRegisterCommon(wss, ws, mess.login);
            websocket.id = id;

            this.setPlayerTimeValue(ws);

            const token = jwt.sign({ id, login }, appConfig.TOKEN_KEY, { expiresIn: '30d' });

            Persistence.setToken(id, token);
            websocket.send(`{"chatServerMessage": "you are registered as ${mess.login}!", "login": "${login}", "setToken": "${token}"}`);

            console.log('user was registered through password');
          } else {
            websocket.send('{"failLogin": "userIsAlreadyRegistered"}');
          }
        } else {
          websocket.send('{"failLogin": "loginNoExist"}');
        }
      } else {
        websocket.send('{"failLogin": "wrongLoginOrPass"}');
      }
    }
  }

  private isHost(amountRegisteredUsers, wss: Server) {
    if (amountRegisteredUsers === 1) {
      return 'host';
    }

    return this.isThereHosts(wss.clients) ? 'notHost' : 'host';
  }

  private isThereHosts(clients) {
    let isThereHost = false;

    clients.forEach((client) => {
      if (client.isRegistered && client.isHost) {
        isThereHost = true;
      }
    });

    return isThereHost;
  }

  private getSeed(amountRegisteredUsers, clients): string {
    if (amountRegisteredUsers === 1) {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    let seed = '';

    clients.forEach((client) => {
      if (client.isRegistered && client.seed) {
        seed = client.seed;
      }
    });

    return seed;
  }

  private getUserID(clients) {
    let UID = getUUID();

    while (this.isUserIDExist(clients, UID)) {
      UID = getUUID();
    }

    return UID;
  }

  private getAmountOfRegisteredUsers(clients) {
    let registered = 0;

    clients.forEach((client) => {
      if (client.isRegistered) {
        registered += 1;
      }
    });

    return registered;
  }

  private isUserIDExist(clients, id: string) {
    let isExist = false;

    clients.forEach((client) => {
      if (client.token === id) {
        isExist = true;
      }
    });

    return isExist;
  }

  private isUserAlreadyRegistered(clients, id: string) {
    let isExist = false;

    clients.forEach((client) => {
      if (client.id === id) {
        isExist = true;
      }
    });

    return isExist;
  }

  private getWSTokensString(clients) {
    const tokens = [];

    clients.forEach((client) => {
      if (client.isRegistered) {
        tokens.push(client.token);
      }
    });

    return tokens.join('___');
  }

  private sendOnlyToYou(websocket: IWebSocketServer, mes: string) {
    websocket.send(mes);
  }

  private sendToEveryRegistered(clients, mes: string) {
    clients.forEach((client) => {
      if (client.isRegistered) {
        client.send(mes);
      }
    });
  }

  private sendToEveryone(clients, mes: string) {
    clients.forEach((client) => {
      client.send(mes);
    });
  }

  private sendToAllButNotYou(websocket: IWebSocketServer, clients, mes: string) {
    clients.forEach((client) => {
      if (client.token !== websocket.token && client.isRegistered) {
        client.send(mes);
      }
    });
  }
}
