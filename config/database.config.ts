import { Client } from 'pg';

const connectionString = 'postgresql://CALIDO-DESARROLLO_owner:fcwzrF0QJj1Y@ep-dark-bird-a5pxkbln.us-east-2.aws.neon.tech/CALIDO_DESARROLLO?sslmode=require';

const client = new Client({
  connectionString: connectionString
});

export const connectDatabase = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    client.connect((err: Error | null) => {
      if (err) {
        console.error('Error connecting to database', err.stack);
        reject(err);
      } else {
        console.log('Connected to database');
        resolve();
      }
    });
  });
};
