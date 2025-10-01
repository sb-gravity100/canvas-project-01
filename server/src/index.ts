// require('dotenv').config();
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { Debugger } from 'debug';
import open from 'open';
import apiRoute from './routes/api';


const { NODE_ENV, PORT = 8000 } = process.env;
const CWD = process.cwd()
const isDev = NODE_ENV === 'development'

async function bootstrap() {
   const debug: Debugger = require('debug')('server');
   const app = express();

   await new Promise<void>((resolve) => app.listen(PORT, resolve));
   debug('Listening to %s', PORT);
   open('http://localhost:8000');

   return {
      debug,
      app,
   };
}

bootstrap().then(({ app, debug }) => {
   app.use(
      morgan('common', {
         stream: {
            write: (msg) => debug(msg.trimEnd()),
         },
      })
   );
   app.use(cors());
   app.use('/static', express.static('./static'));
   app.use('/', express.static('../public'));
   app.use('/api', apiRoute)

   app.use('/', express.static('./build'));
});
