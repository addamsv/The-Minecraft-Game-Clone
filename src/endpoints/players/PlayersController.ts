import * as express from 'express';
import { Response, Request } from 'express';
import getScoreList from './PlayersService';

const router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<any> => getScoreList(res));

const Players = () => router;
export default Players;
