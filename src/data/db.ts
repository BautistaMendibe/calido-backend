import { Pool } from 'pg';

const PoolDb = new Pool({
  user: 'CALIDO-DESARROLLO_owner',
  host: 'ep-dark-bird-a5pxkbln.us-east-2.aws.neon.tech',
  database: 'CALIDO_DESARROLLO',
  password: 'fcwzrF0QJj1Y',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

export default PoolDb;
