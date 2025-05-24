import * as express from 'express';
import * as cors from 'cors';
import path = require('path');
import bodyParser = require('body-parser');
import Players from './players/PlayersController';
import Auth from './auth/AuthController';

const app = express();

// if (!IS_PROD) {
//   console.log("ENV.IS_PROD: ", IS_PROD);
//   console.log("statistics: ", "http://localhost:" + DEV_PORT);
// }

app.use(bodyParser.json());

app.use(cors());
// app.use(cors(corsOptionsDelegate));

/* API | ROUTES */
// /api/v1/players
app.use('/players', Players());
app.use('/auth', Auth());

/* PUBLIC | STATIC VIEW */
app.use(express.static(path.join(__dirname, '..', '..', 'public')));

const getExpressApp = () => app;

export default getExpressApp;
