import * as http from 'http';
import getExpressApp from './src/endpoints';
import MinecraftWebSocket from './src/socket/webSocket';
import { normalizePort } from './src/utils/normalizePort';

const port = normalizePort(process.env.PORT || '3001');

const server: http.Server = http.createServer();

const webSocket = new MinecraftWebSocket();

webSocket.wssInit(server);

server.on('request', getExpressApp());
server.listen(port, () => {
  console.log(`Listening on ${port}`);
  console.log(`Stat: on http://localhost:${port}/`);
});
