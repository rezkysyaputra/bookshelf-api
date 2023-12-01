import pkg from '@hapi/hapi';
import { routes } from './routes/routes.js';
import { client } from './models/bookModel.js';
const Hapi = pkg;

const init = async () => {
  const server = Hapi.Server({
    port: 9000,
    host: 'localhost',
  });
  await client.connect();
  console.log('Connected to PostgreSql');

  server.route(routes);

  await server.start();
  console.log(`Server is running on ${server.info.uri}`);
};

init();
