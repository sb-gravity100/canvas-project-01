require('dotenv').config();
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

const { NODE_ENV, PORT } = process.env;

async function bootstrap() {
   const debug = (await import('debug')).default('server');
   const app = express();

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
   if (NODE_ENV !== 'development') {
      app.use(express.static('./build'));
   }
});
