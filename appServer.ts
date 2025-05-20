import * as http from 'http';
import HttpServerModelInterface from './server/express/httpServerModelInterface';
import { HttpServerModel } from './server/express/httpServerModel';
import { WebSocketModel, WebSocketModelInterface } from './server/socket/webSocketModel';

const normalizePort = (val: any) => {
  const normPort = parseInt(val, 10);
  if (Number.isNaN(normPort)) {
    return val;
  }
  return normPort >= 0 ? normPort : false;
};

const port = normalizePort(process.env.PORT || '3001');

const server: http.Server = http.createServer();

const webSocket: WebSocketModelInterface = new WebSocketModel();

const httpServer: HttpServerModelInterface = new HttpServerModel();

webSocket.wssInit(server);

server.on('request', httpServer.getExpressApp());
server.listen(port, () => {
  console.log(`Listening on ${port}`);
  console.log(`Stat: on http://localhost:${port}/`);
});
