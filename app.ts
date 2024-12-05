import 'reflect-metadata';
import 'dotenv/config';
import { Request, Response } from 'express';
import express from 'express';
import * as bodyParser from 'body-parser';
import { AppRoutes } from './routes';
import { checkSchema, validationResult } from 'express-validator';
import { logger } from './src/logger/CustomLogger';
import { connectDatabase } from './src/data/db';
import cors from 'cors';
import { authenticateToken } from './middlewares/AuthValidator';
import { requireAdminRole } from './middlewares/RolValidator';

// create express app
export const app = express();
app.use(bodyParser.json({ limit: '200mb' }));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cors());

// Middleware para autenticar el token
app.use(authenticateToken);

// Middleware para verificar roles de administrador
app.use(requireAdminRole);

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store'); // Evita almacenamiento en caché
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// register all application routes
AppRoutes.forEach((route) => {
  const middlewares = route.middleware || [];

  app.use(route.path, ...middlewares, checkSchema(route.schema), (request: Request, response: Response, next: Function) => {
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

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  await app.listen(PORT, () => {
    logger.info(`Server running on http://127.0.0.1:${PORT}`);
  });
};

(async () => {
  connectDatabase();
  await startServer();
})();
