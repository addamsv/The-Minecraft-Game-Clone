/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import dbg from 'debug';
import * as http from 'http';
import { WebSocketModelInterface, WebSocketModel } from './webSocketModel';
import { HttpServerModelInterface, HttpServerModel } from './httpServerModel';
import AppServerInterface from './appServerInterface';

class AppServer implements AppServerInterface {
  private server: http.Server;

  private port: any;

  private webSocketModel: WebSocketModelInterface;

  private httpServerModel: HttpServerModelInterface;

  constructor() {
    this.server = http.createServer();
    this.port = this.normalizePort(process.env.PORT || '3001');
    this.webSocketModel = new WebSocketModel();
    this.httpServerModel = new HttpServerModel();
  }

  public start() {
    this.webSocketModel.wssInit(this.server);

    this.server.on('request', this.httpServerModel.getExpressApp());
    this.server.listen(this.port, () => console.log(`Listening on ${this.port}`));
    this.server.on('error', this.onError.bind(this));
    this.server.on('listening', this.onListening.bind(this));
  }

  private onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof this.port === 'string'
      ? `Pipe ${this.port}`
      : `Port ${this.port}`;

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

  private onListening() {
    const debug = dbg('rs-clone-server:server');
    const addr = this.server.address();
    const bind = typeof addr === 'string'
      ? `pipe ${addr}`
      : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
  }

  private normalizePort(val: any) {
    const normPort = parseInt(val, 10);
    if (Number.isNaN(normPort)) {
      return val;
    }
    return normPort >= 0 ? normPort : false;
  }
}

export { AppServerInterface, AppServer };
