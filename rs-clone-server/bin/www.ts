import dbg from 'debug';
import * as http from 'http';

/**
 *    Try to Create Multiplayer
 */
import { Server } from 'ws';
import app from '../app';

const debug = dbg('rs-clone-server:server');

/**
 * Create HTTP server.
 */
const server = http.createServer();

const wss = new Server({
  server,
  perMessageDeflate: false,
});

function getUniqueID() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

wss.on('connection', (ws, req) => {
  const websocket = ws;
  websocket.id = getUniqueID();
  console.log(`Client connected ${req.headers['sec-websocket-key']}`);

  websocket.on('close', () => console.log('Client disconnected'));

  websocket.on('message', (websocketData) => {
    try {
      const w = JSON.parse(websocketData);
      console.log(w.userName);
    } catch (er) {
      console.log(er);
    }

    wss.clients.forEach((client) => {
      console.log(`Client.ID: ${client.id}`);
      console.log(websocketData);

      client.send(websocketData);
    });
  });
});

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const normPort = parseInt(val, 10);

  if (Number.isNaN(normPort)) {
    return val;
  }

  return normPort >= 0 ? normPort : false;
}

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3000');

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

/**
 * Listen on provided port, on all network interfaces.
 */
server.on('request', app);
server.listen(port, () => console.log(`Listening on ${port}`));
server.on('error', onError);
server.on('listening', onListening);
