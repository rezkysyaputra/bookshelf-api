import pkg from '@hapi/hapi';
import { routes } from './routes/routes.js';
import pg from 'pg';
const Hapi = pkg;
const { Client } = pg;

export const client = new Client({
  user: 'rezky',
  host: 'localhost',
  database: 'bookshelf',
  password: 'admin',
  port: 5432,
});

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
