import { Pool } from 'pg';

const connectionString = 'postgresql://CALIDO-DESARROLLO_owner:fcwzrF0QJj1Y@ep-dark-bird-a5pxkbln.us-east-2.aws.neon.tech/CALIDO_DESARROLLO?sslmode=require';

const pool = new Pool({
  connectionString: connectionString,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 10000,
  max: 4
});

const gracefulShutdown = async (signal: string) => {
  console.log(`Received ${signal}, closing pool...`);
  await pool.end();
  console.log('Pool has been closed');
  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const connectDatabase = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log('Connected to database');
    client.release();
  } catch (err) {
    console.error('Error connecting to the database:', err.stack);
    throw err;
  }
};
