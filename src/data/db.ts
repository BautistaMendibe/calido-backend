import { Pool } from 'pg';
import { Schedulers } from '../schedulers/Schedulers';

/**
 * Create a new pool to connect to the database.
 * The pool will manage multiple clients and handle the connection to the database.
 */
const PoolDb = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'CALIDO_DESARROLLO',
  password: '42699303',
  port: 5432,
  connectionTimeoutMillis: 250000,
  idleTimeoutMillis: 250000,
  max: 10
});

/**
 * Gracefully shutdown the pool when the process is terminated
 * or receives a signal to shut down.
 * @param signal
 */
const shutdown = async (signal: string) => {
  console.log(`Received ${signal}, closing pool...`);
  try {
    await PoolDb.end();
    console.log('Pool closed');
  } catch (err) {
    console.error('Error closing pool:', err);
  }

  process.exit(0);
};

/**
 * Gracefully shutdown the pool when the process is terminated
 * or receives a signal to shut down.
 * SIGINT and SIGTERM are the signals sent when using CTRL+C or
 * when the process is terminated by a process manager.
 * @param {string} signal The signal received
 */
['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, () => shutdown(signal));
});

/**
 * Attempt to reconnect to the database when an error occurs on an idle client.
 * This is useful when the database server is restarted.
 * The client will try to reconnect up to 5 times, waiting 5 seconds between each attempt.
 * If it fails to reconnect after 5 attempts, the process will exit.
 */
PoolDb.on('error', async (err) => {
  console.error('Unexpected error on idle client', err);

  for (let i = 1; i <= 5; i++) {
    try {
      console.log(`Attempt ${i} to reconnect...`);
      const client = await PoolDb.connect();
      client.release();
      console.log('Reconnected to database');
      break;
    } catch (reconnectErr) {
      console.error('Reconnection attempt failed', reconnectErr);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  console.error('Failed to reconnect after 5 attempts, exiting...');
  process.exit(-1);
});

/**
 * Connect to the database and log a message when the connection is successful.
 * If an error occurs, log the error and throw it.
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    const client = await PoolDb.connect();
    console.log('Connected to database');
    client.release();

    const schedulers = new Schedulers();
    console.log('Schedulers initialized');
  } catch (err) {
    console.error('Error connecting to the database:', err.stack);
    throw err;
  }
};

export default PoolDb;
