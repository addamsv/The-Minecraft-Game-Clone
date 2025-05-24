import * as express from 'express';
import { Response, Request } from 'express';
import Postgre from '../../model/postgreModel';
import Ret from '../../model/Ret';

const router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const list = await Postgre.score();

    // res.json(list);

    return Ret.Standard(res, {
      statusCode: 200,
      message: 'Score List',
      data: list,
    });
  } catch (e: unknown) {
    return Ret.err500(res, `err: Login ${e instanceof Error ? e.message : ''}`);
  }
});

const Players = () => router;
export default Players;
