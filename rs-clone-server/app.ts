import * as express from 'express';
import * as logger from 'morgan';
import * as cors from 'cors';
// import * as http from 'http';
import playersRouter from './routes/players';

const app = express();
// const CORS_OPTIONS = {}; // {origin: 'http://example.com'};{msg: 'This is CORS-enabled for only example.com.'}

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/players', playersRouter);
app.use(express.static('view'));
app.use((req, res) => {
  res.sendFile('./view/index.html', { root: __dirname });
});

/*
* Error handler
*/
app.use((err, req, res, next) => {
  res.json({
    statusCode: 500, // 404
    message: err.message,
    stack: err.stack,
  });
  next();
});
export default app;
