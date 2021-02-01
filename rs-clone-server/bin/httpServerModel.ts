/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import * as express from 'express';
import * as logger from 'morgan';
import * as cors from 'cors';
// import * as http from 'http';
import authRouter from '../routes/auth';
import playersRouter from '../routes/players';
import HttpServerModelInterface from './httpServerModelInterface';

class HttpServerModel implements HttpServerModelInterface {
  private app: any;

  constructor() {
    this.expressApp();
  }

  public getExpressApp() {
    return this.app;
  }

  private expressApp() {
    this.app = express();

    this.app.use(cors());
    this.app.use(logger('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.routes();
    this.staticViews();
    this.errors();
  }

  private staticViews() {
    this.app.use(express.static('view'));
    this.app.use((req, res) => {
      res.sendFile('./view/index.html', { root: __dirname });
    });
  }

  private errors() {
    this.app.use((err, req, res, next) => {
      res.status(404).json({
        statusCode: 404,
        message: 'page not found',
      });
      next();
    });

    this.app.use((err, req, res, next) => {
      res.status(500).json({
        statusCode: 500, // 404
        message: err.message,
        stack: err.stack,
      });
      next();
    });
  }

  private routes() {
    this.app.use('/auth', authRouter);
    this.app.use('/players', playersRouter);
  }
}

export { HttpServerModelInterface, HttpServerModel };
