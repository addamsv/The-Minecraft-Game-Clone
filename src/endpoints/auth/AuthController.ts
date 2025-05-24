import * as express from 'express';
// import { Auth } from '../../model/Auth';
// import { Ret } from '../../model/Ret';
// import { IS_PROD } from '../../../conf';
// import { Persistence } from '../../model/Persistence';
import * as jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { Response, Request } from 'express';
import appConfig from '../../../app-config';
import Postgre from '../../model/postgreModel';
import Ret from '../../model/Ret';

const router = express.Router();

router.post('/login', async (req: Request, res: Response): Promise<any> => {
  try {
    /*
      iss — (issuer) издатель токена
      sub — (subject) "тема", назначение токена
      aud — (audience) аудитория, получатели токена
      exp — (expire time) срок действия токена
      nbf — (not before) срок, до которого токен не действителен
      iat — (issued at) время создания токена 30d (days), 1h (hour)
      jti — (JWT id) идентификатор токена
    */

    if (req.headers.authorization) {
      let tokenId = '';

      jwt.verify(req.headers.authorization.split(' ')[1], appConfig.TOKEN_KEY, async (err, payload) => {
        if (err || !payload) {
          throw new Error('err: jwt verify');
        }

        // eslint-disable-next-line dot-notation
        tokenId = payload['id'];
      });

      const candidate = await Postgre.getById(tokenId);

      if (!candidate || req.body.login !== candidate.login) {
        Ret.err401(res, 'err: could not find the candidate');
      }

      return Ret.Standard(res, {
        statusCode: 200,
        message: 'User is Authorized',
        name: candidate.login,
        token: jwt.sign({ id: candidate.id, login: req.body.login }, appConfig.TOKEN_KEY, { expiresIn: '30d' }),
      });
    }

    if (!req.body.login || !req.body.password) {
      Ret.err401(res, 'no login or pass');
    }

    /* if login and pass within the body */

    const id = '';

    const candidateByLogin = await Postgre.getByLogin(req.body.login);

    if (!candidateByLogin) {
      Ret.err401(res, 'err: could not find the candidate');
    }

    if (
      candidateByLogin.login === req.body.login
          && candidateByLogin.password === req.body.password // should be crypt
    ) {
      return Ret.Standard(res, {
        statusCode: 200,
        message: 'User is Authorized',
        name: req.body.login,
        token: jwt.sign({ id, login: req.body.login }, appConfig.TOKEN_KEY, { expiresIn: '30d' }),
      });
    }

    return Ret.err401(res);
  } catch (e: unknown) {
    return Ret.err500(res, `err: Login ${e instanceof Error ? e.message : ''}`);
  }
});

router.post('/reg', async (req: Request, res: Response): Promise<any> => {
  try {
    const { body } = req;

    const items = await Postgre.getByLogin(body.login);

    if (items) {
      return Ret.err401(res, `the login '${body.login}' is already exist`);
    }

    body.id = uuid();

    const pgResp = await Postgre.create(body);

    if (!pgResp) {
      return Ret.err500(res, 'DB error');
    }

    return Ret.Standard(res, {
      statusCode: 200,
      message: 'User is successfully Created',
      name: body.login,
      token: jwt.sign({ id: body.id, login: body.login }, appConfig.TOKEN_KEY, { expiresIn: '30d' }),
    });
  } catch (e: unknown) {
    return Ret.err500(res, `err: Register ${e instanceof Error ? e.message : ''}`);
  }
});

router.post('/signin', async (req: Request, res: Response): Promise<any> => Ret.err401(res));

router.post('/recovery', async (req: Request, res: Response): Promise<any> => Ret.err401(res));

/** reset pass */
router.post('/reset', async (req: Request, res: Response): Promise<any> => Ret.err401(res));

const Auth = () => router;
export default Auth;
