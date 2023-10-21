'use strict';
import pkg from '@hapi/hapi';
import { routes } from './routes.js';

const Hapi = pkg;
const init = async () => {
  const server = Hapi.Server({
    port: 9000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log(`Server is running on ${server.info.uri}`);
};

init();
