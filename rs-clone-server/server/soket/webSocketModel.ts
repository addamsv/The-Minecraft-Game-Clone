/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import { Server } from 'ws';
import * as jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import appConfig from '../../app-config';
import WebSocketModelInterface from './webSocketModelInterface';
import { PostgreInterface, Postgre } from '../../storage/postgreModel';

interface PayloadInterface extends Object {
  id: string;
  login: String;
  password: String;
}

class WebSocketModel implements WebSocketModelInterface {
  private postgre: PostgreInterface;

  constructor() {
    this.postgre = new Postgre();
  }

  public wssInit(server: any) {
    const wss: Server = new Server({
      server,
      perMessageDeflate: false,
    });

    wss.on('connection', (ws) => {
      const websocket = ws;

      websocket.on('close', () => {
        this.sendToEveryRegistered(wss.clients, `{"gameDisconnectedMessage": "${websocket.token}", "chatServerMessage": "the user ${websocket.userName} has disconnected  (connected: ${wss.clients.size})"}`);
        console.log(`${websocket.token || 'guest\'s'} connection closed`);
      });

      websocket.on('message', (websocketData) => {
        if (websocketData[0] !== '{') {
          this.onMessageWithCode(wss, websocket, websocketData);
          return;
        }
        this.sendToEveryone(wss.clients, websocketData);
      });
    });
  }

  private onMessageWithCode(wss, currSocketConnection, websocketData) {
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
        // console.log('ping');
        break;
      }
      default: break;
    }
  }

  private onRegisterCommon(wss, ws, userName) {
    const websocket = ws;
    websocket.isRegistered = true;
    // req.headers['sec-websocket-key'];
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

  private async signUp(wss, mess, ws) {
    const websocket = ws;
    const items = await this.postgre.getLogin(mess.login);
    if (items === undefined && mess.login && mess.password) {
      const body = { login: mess.login, password: mess.password, id: uuid() };
      const pgResp = await this.postgre.create(body);
      if (pgResp) {
        websocket.send(`{"mesSignIn": "signed", "login": "${body.login}"}`);
        console.log('user was signed-Up');
      } else {
        websocket.send('{"failSignIn": "wasWrongBD"}');
        console.log('Password was not registered: something was wrong with BD');
      }
    } else {
      websocket.send('{"failSignIn": "userIsAlreadyRegistered"}');
    }
  }

  private async changePassword(wss, ws, mess) {
    const websocket = ws;
    if (mess.newPassword) {
      const item = await this.postgre.updatePassword(websocket.id, mess.newPassword);
      if (item) {
        websocket.send('{"mesChangePassword": "passChanged"}'); // Password was successfully changed
        console.log('Password was successfully changed');
      } else {
        websocket.send('{"failChangePassword": "wasWrongBD"}');
        console.log('Password was not unregistered: something was wrong with BD');
      }
    }
  }

  private async logOut(wss, ws) {
    const websocket = ws;
    const item = await this.postgre.logOutById(websocket.id);
    if (item) {
      websocket.isRegistered = false;
      websocket.send('{"logOutMessage": "logOut"}');
      websocket.send(`{"chatServerMessage": "you are unregistered as ${websocket.login}!"}`);
      console.log('user was successfully unregistered');
    } else {
      websocket.send('{"failLogOut": "wasWrongBD"}');
      console.log('user was not unregistered: something was wrong with BD');
    }
  }

  private login(wss, mess, ws) {
    const websocket = ws;
    jwt.verify(
      mess.userToken,
      appConfig.TOKEN_KEY,
      async (err, payload: PayloadInterface) => {
        if (err) {
          websocket.send('{"failLogin": "wrongOrExpiredToken"}');
        }
        if (payload) {
          const item = await this.postgre.getById(payload.id);
          if (item) {
            if (!this.isUserAlreadyRegistered(wss.clients, payload.id)) {
              this.onRegisterCommon(wss, ws, payload.login);
              websocket.id = payload.id;
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

  private async loginThroughPass(wss, mess, ws) {
    const websocket = ws;
    if (mess.login && mess.password) {
      const item = await this.postgre.getLogin(mess.login);
      if (item) {
        if (item.login === mess.login && item.password === mess.password) {
          const { id } = item;
          const { login } = item;
          // console.log(`id ${id}`);
          if (!this.isUserAlreadyRegistered(wss.clients, id)) {
            this.onRegisterCommon(wss, ws, mess.login);
            // websocket.isRegistered = true;
            websocket.id = id;
            // websocket.userName = mess.login;
            const token = jwt.sign({ id, login }, appConfig.TOKEN_KEY, { expiresIn: '30d' });
            this.postgre.setToken(id, token);
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

  private isHost(amountRegisteredUsers, wss) {
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

  private getSeed(amountRegisteredUsers, clients) {
    if (amountRegisteredUsers === 1) {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    let seed;
    clients.forEach((client) => {
      if (client.isRegistered && client.seed) {
        seed = client.seed;
      }
    });
    return seed;
  }

  private getUserID(clients) {
    let UID = this.getUUID();
    while (this.isUserIDExist(clients, UID)) {
      UID = this.getUUID();
    }
    return UID;
  }

  private getUUID() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
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

  private isUserIDExist(clients, id) {
    let isExist = false;
    clients.forEach((client) => {
      if (client.token === id) {
        isExist = true;
      }
    });
    return isExist;
  }

  private isUserAlreadyRegistered(clients, id) {
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

  private sendOnlyToYou(websocket, string) {
    websocket.send(string);
  }

  private sendToEveryRegistered(clients, string) {
    clients.forEach((client) => {
      if (client.isRegistered) {
        client.send(string);
      }
    });
  }

  private sendToEveryone(clients, string) {
    clients.forEach((client) => {
      client.send(string);
    });
  }

  private sendToAllButNotYou(websocket, clients, string) {
    clients.forEach((client) => {
      if (client.token !== websocket.token && client.isRegistered) {
        client.send(string);
      }
    });
  }
}
export { WebSocketModelInterface, WebSocketModel };
