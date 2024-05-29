import 'reflect-metadata';
import 'dotenv/config';
import { Request, Response } from 'express';
import express from 'express';
import * as bodyParser from 'body-parser';
import { AppRoutes } from './routes';
import { checkSchema, validationResult } from 'express-validator';
import { logger } from './src/logger/CustomLogger';
import cookieParser from 'cookie-parser';
import { connectDatabase } from './config/database.config';

// create express app
export const app = express();
app.use(bodyParser.json({ limit: '200mb' }));
app.use(cookieParser());
process.env.TZ = 'America/Argentina/Cordoba';
// register all application routes
AppRoutes.forEach((route) => {
  app.use(route.path, checkSchema(route.schema), (request: Request, response: Response, next: Function) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.json(validationResult(request).array());
    }
    route
      .action(request, response)
      .then(() => next)
      .catch((err: any) => next(err));
  });
});

const startServer = async () => {
  await app.listen(process.env.PORT || 8080, () => {
    logger.info(`Server running on http://127.0.0.1:${process.env.PORT}`);
  });
};

(async () => {
  connectDatabase();
  await startServer();
})();
