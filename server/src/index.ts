require('dotenv').config();
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import handlebars from 'express-handlebars'
import path from 'path/win32';
import { Debugger } from 'debug';

const { NODE_ENV, PORT } = process.env;
const CWD = process.cwd()
const isDev = NODE_ENV === 'development'

async function bootstrap() {
   const debug: Debugger = require('debug')('server');
   const app = express();
   const hbs = handlebars.create({
      defaultLayout: 'main',
      layoutsDir: 'layouts',
      partialsDir: 'partials',
      extname: '.hbs',
   })

   app.set('view engine', 'hbs')
   app.set('views', './views')
   app.engine('hbs', hbs.engine)

   await new Promise<void>((resolve) => app.listen(PORT, resolve));
   debug('Listening to %s', PORT);

   return {
      debug,
      app,
   };
}

bootstrap().then(({ app, debug }) => {
   app.use(
      morgan('dev', {
         stream: {
            write: (msg) => debug(msg.trim()),
         },
      })
   );
   app.use(cors());
   app.use('/static', express.static('./static'));
   if (!isDev) {
      app.use(express.static('./build'));
   }
});
