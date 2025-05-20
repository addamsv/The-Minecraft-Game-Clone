import * as express from 'express';
import * as bodyParser from 'body-parser';
import { PostgreInterface, Postgre } from '../../../storage/postgreModel';
import RoutesInterface from './routesInterface';

class PlayersRouter implements RoutesInterface {
  private router: any;

  private postgre: PostgreInterface;

  constructor() {
    this.postgre = new Postgre();
    this.router = express.Router();
    this.router.use(bodyParser.json());
    this.connectRouts();
  }

  public getRouts() {
    return this.router;
  }

  private connectRouts() {
    this.playerScore();
  }

  private playerScore() {
    this.router.get('/', async (req, res) => {
      const list = await this.postgre.score();

      res.json(list);
    });
  }
}

export default PlayersRouter;
