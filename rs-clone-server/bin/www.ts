import dbg from 'debug';
import * as http from 'http';
import app from '../app';
import WSServer from '../routes/socket';

const debug = dbg('rs-clone-server:server');

const server = http.createServer();

const socket = new WSServer();

socket.wssInit(server);

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
const port = normalizePort(process.env.PORT || '3001');

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
      // eslint-disable-next-line no-console
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      // eslint-disable-next-line no-console
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
//
server.on('error', onError);
server.on('listening', onListening);
