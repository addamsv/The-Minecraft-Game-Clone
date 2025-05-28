import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { Response, Request } from 'express';
import appConfig from '../../../app-config';
import Persistence from '../../model/postgreModel';
import Ret from '../../model/Ret';

const router = express.Router();

interface IPayload extends jwt.JwtPayload {
  id: string;
}

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

    /**
     * notice! all data (Basic login:pass or Bearer JWT) should be in req.headers.authorization
     * claims should contain at least user ID as 'id' and user login name as 'login'
     *
     * example of req:
     * curl -X POST localhost:3001/auth/login -u user:123 -v
     * curl -X POST localhost:3001/auth/login -H "Authorization: Bearer eyJhb.eyJpc=.991b4db0" -v
     */

    if (req.headers.authorization) {
      const claims = {
        id: '',
        login: '',
      };

      jwt.verify(req.headers.authorization.split(' ')[1], appConfig.TOKEN_KEY, async (err, payload: IPayload) => {
        if (err || !payload) {
          throw new Error('err: jwt verify');
        }

        claims.id = payload.id;
        claims.login = payload.login;
      });

      const candidate = await Persistence.getById(claims.id);

      // if (!candidate || req.body.login !== candidate.login) {
      if (!candidate || claims.login !== candidate.login) {
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

    /* if login and pass within the body (but should be in req.headers.authorization) */
    const candidateByLogin = await Persistence.getByLogin(req.body.login);

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
        token: jwt.sign({ id: candidateByLogin.id, login: req.body.login }, appConfig.TOKEN_KEY, { expiresIn: '30d' }),
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

    const isNameAlreadyExist = await Persistence.getByLogin(body.login);

    if (isNameAlreadyExist) {
      return Ret.err401(res, `the login '${body.login}' is already exist`);
    }

    body.id = uuid();

    const newUser = await Persistence.create(body);

    if (!newUser) {
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

// router.post('/signin', async (req: Request, res: Response): Promise<any> => Ret.err401(res));

router.post('/recovery', async (req: Request, res: Response): Promise<any> => Ret.err401(res));

/** reset pass */
router.post('/reset', async (req: Request, res: Response): Promise<any> => Ret.err401(res));

const Auth = () => router;
export default Auth;
