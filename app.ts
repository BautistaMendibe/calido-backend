import 'reflect-metadata';
import 'dotenv/config';
import { Request, Response } from 'express';
import express from 'express';
import * as bodyParser from 'body-parser';
import { AppRoutes } from './routes';
import { checkSchema, validationResult } from 'express-validator';
import { logger } from './src/logger/CustomLogger';
import { connectDatabase } from './config/database.config';
import cors from 'cors';
import jwt from 'jsonwebtoken';

// create express app
export const app = express();
app.use(bodyParser.json({ limit: '200mb' }));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cors());

// Middleware de autenticación
const authenticateToken = (req: Request, res: Response, next: Function) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token del header
  const secret = 'secret'; // Asegúrate de usar el mismo secret que para firmar el token
  const rutasPermitidas = ['/usuarios/validar-inicio-sesion', '/configuraciones/existe-configuracion'];

  if (rutasPermitidas.includes(req.path)) return next();

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  jwt.verify(token, secret, (err: any) => {
    if (err) {
      return res.status(401).json({ message: 'Token is invalid or expired' });
    }
    next();
  });
};

// Usar middleware en todas las rutas a excepción de las rutas permitidas.
app.use(authenticateToken);

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
  await app.listen(8080, () => {
    logger.info(`Server running on http://127.0.0.1:8080`);
  });
};

(async () => {
  connectDatabase();
  await startServer();
})();
