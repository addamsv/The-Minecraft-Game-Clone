import { v4 as uuid } from 'uuid';
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
    /**
     * uncomment this lines in order to use RESTful API though HTTPS
     */
    /*
    this.playerByItsID();
    this.createPlayerThroughItsLoginAndPassword();
    this.updatePlayersLoginAndPasswords();
    this.deletePlayerThroughItsID();
    */
  }

  private playerScore() {
    this.router.get('/', async (req, res) => {
      const list = await this.postgre.score();

      res.json(list);
    });
  }

  private playerByItsID() {
    this.router.get('/:id', async (req, res) => {
      const item = await this.postgre.getById(req.params.id);

      res.status(item ? 200 : 404).json(item ?? { statusCode: 404 });
    });
  }

  private createPlayerThroughItsLoginAndPassword() {
    this.router.post('/', async (req, res) => {
      const id = uuid();

      const { body } = req;

      body.id = id;

      const newBody = await this.postgre.create(body);
      res.json(newBody);
    });
  }

  private updatePlayersLoginAndPasswords() {
    this.router.put('/:id', async (req, res) => {
      const { body } = req;

      const newBody = await this.postgre.update({
        ...body,
        id: req.params.id,
      });

      res.json(newBody);
    });
  }

  private deletePlayerThroughItsID() {
    this.router.delete('/:id', async (req, res) => {
      await this.postgre.remove(req.params.id);

      res.status(204).json(null);
    });
  }
}

export default PlayersRouter;
