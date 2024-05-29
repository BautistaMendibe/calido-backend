import { config } from 'dotenv';
config();

/**
 * Application configuration.
 * Ideally, this should be loaded from a config file, and the only place where
 * environment variables are read.
 */
export const appConfig = {
  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    serviceName: process.env.DB_SERVICE_NAME
  }
};
