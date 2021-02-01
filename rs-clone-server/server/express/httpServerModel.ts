/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import * as express from 'express';
import * as logger from 'morgan';
import * as cors from 'cors';
import HttpServerModelInterface from './httpServerModelInterface';
import AuthRouter from './routs/authRouter';
import PlayersRouter from './routs/playersRouter';
import RoutesInterface from './routs/routesInterface';

class HttpServerModel implements HttpServerModelInterface {
  private app: any;

  private authRouter: RoutesInterface;

  private playersRouter: PlayersRouter;

  constructor() {
    this.authRouter = new AuthRouter();
    this.playersRouter = new PlayersRouter();
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
    this.app.use('/auth', this.authRouter.getRouts());
    this.app.use('/players', this.playersRouter.getRouts());
  }
}

export { HttpServerModelInterface, HttpServerModel };
