import { v4 as uuid } from 'uuid';
import { Router } from 'express';
import * as jwt from 'jsonwebtoken';
import * as bodyParser from 'body-parser';
// import * as storage from '../storage/mongo';
import * as pg from '../storage/postgre';
import appConfig from '../app-config';

const router = Router();

router.use(bodyParser.json());

/*
* Sign-up
*/
router.post('/sign/', async (req, res) => {
  const { body } = req;

  const items = await pg.listAll();

  const isLoginExist = Object.keys(items).some((element) => items[element].login === body.login);

  if (!isLoginExist) {
    body.id = uuid();

    const newBody = await pg.create(body);

    newBody.token = jwt.sign({ id: body.id }, appConfig.TOKEN_KEY, { expiresIn: '30d' });
    newBody.statusCode = 200;
    newBody.name = body.login;

    res.json(newBody);
  } else {
    res.json({
      statusCode: 401,
      message: `the login '${body.login}' is already exist`,
    });
  }
});

/*
* Authentication-Authorization
*/
router.post('/auth/', async (req, res) => {
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
    jwt.verify(req.headers.authorization.split(' ')[1], appConfig.TOKEN_KEY, async (err, payload) => {
      /*
      * if token exist but NOT ok
      */
      if (err) {
        res.json({
          statusCode: 401,
          message: err,
        });
      } else if (payload) {
        /*
        * if token ok
        */
        // eslint-disable-next-line dot-notation
        const item = await pg.getById(payload['id']);
        if (item) {
          res.json({
            statusCode: 200,
            message: 'User is Authorized',
            name: req.body.login,
          });
        } else {
          res.json({
            statusCode: 401,
            message: 'User is NOT Authorized',
          });
        }
      }
    });

  /*
  * if token NOT exist
  */
  } else {
    let isAuthorized: Boolean = false;
    let id: String = '';
    // let name: String = '';

    /*
    * if login and pass within the body
    */
    if (req.body.login && req.body.password) {
      const items = await pg.listAll();
      isAuthorized = Object.keys(items).some((element) => {
        if (
          items[element].login === req.body.login
          && items[element].password === req.body.password
        ) {
          id = items[element].id;
          return true;
        }
        return false;
      });
    }

    if (isAuthorized) {
      res.json({
        statusCode: 200,
        message: 'User is Authorized',
        name: req.body.login,
        token: jwt.sign({ id }, appConfig.TOKEN_KEY, { expiresIn: '30d' }),
      });
    } else {
      res.json({
        statusCode: 401,
        message: 'User is NOT Authorized',
      });
    }
  }
});

router.get('/', async (req, res) => {
  const list = await pg.listAll();

  res.json(list);
});

router.get('/:id', async (req, res) => {
  const item = await pg.getById(req.params.id);

  res.status(item ? 200 : 404).json(item ?? { statusCode: 404 });
});

router.post('/', async (req, res) => {
  const id = uuid();

  const { body } = req;

  body.id = id;

  const newBody = await pg.create(body);
  res.json(newBody);
});

router.put('/:id', async (req, res) => {
  const { body } = req;

  const newBody = await pg.update({
    ...body,
    id: req.params.id,
  });

  res.json(newBody);
});

router.delete('/:id', async (req, res) => {
  await pg.remove(req.params.id);

  res.status(204).json(null);
});

export default router;
