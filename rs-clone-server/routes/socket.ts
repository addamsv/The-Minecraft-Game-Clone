import { Server } from 'ws';
import * as jwt from 'jsonwebtoken';
import appConfig from '../app-config';
import * as pg from '../storage/postgre';

interface PayloadInterface extends Object {
  id: string;
  login: String;
  password: String;
}

class WSServer {
  public wssInit(server: any) {
    const wss: Server = new Server({
      server,
      perMessageDeflate: false,
    });

    wss.on('connection', (ws, req) => {
      const websocket = ws;

      // websocket.id = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

      websocket.token = req.headers['sec-websocket-key'];

      websocket.userName = 'Guest';

      console.log(`client.token ${wss.clients.size}`);

      wss.clients.forEach((client) => {
        if (client.token === req.headers['sec-websocket-key']) {
          const userToken = this.getCookie(req.headers.cookie);
          if (!userToken) {
            return;
          }
          jwt.verify(userToken, appConfig.TOKEN_KEY, async (err, payload: PayloadInterface) => {
            if (payload) {
              const item = await pg.getById(payload.id);
              if (item) {
                let isAlreadyRegistered = false;
                wss.clients.forEach((clientInner) => {
                  if (clientInner.id === payload.id) {
                    // console.log('user already registered');
                    isAlreadyRegistered = true;
                  }
                });
                if (!isAlreadyRegistered) {
                  // console.log('user was registered');
                  websocket.isRegistered = true;
                  websocket.id = payload.id;
                  websocket.userName = payload.login;
                  client.send(`{"setWsToken": "${client.token}", "setUserName": "${payload.login}", "chatServerMessage": "you are registered, ${payload.login}!"}`);
                }
              }
            }
          });

          client.send(`{"setWsToken": "${client.token}", "setUserName": "Guest"}`);
        }
        client.send('{"chatServerMessage": "User has connected"}');
      });

      websocket.on('close', () => {
        wss.clients.forEach((client) => {
          client.send(`{"chatServerMessage": "the user ${websocket.userName} has disconnected"}`);
        });
      });

      websocket.on('message', (websocketData) => {
        wss.clients.forEach((client) => {
          if (client.token === websocket.token && client.isRegistered) {
            // console.log('user can act as if is registered');
          }
          client.send(websocketData);
        });
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private getCookie(cookie: any) {
    let out = '';
    cookie.split('; ').some((element) => {
      const [first, sec] = element.split('=');
      if (first === 'X-Authorization') {
        out = sec;
        return true;
      }
      return false;
    });
    return out;
  }
}

export default WSServer;
