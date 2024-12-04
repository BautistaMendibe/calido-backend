import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Middleware para autenticar el token recibido por el interceptor HTML
 * Obtiene el token del header y lo verifica con el secret.
 * Si el token es válido, permite el acceso a la ruta solicitada.
 * Si el token no es válido, devuelve un error 401.
 * @param req
 * @param res
 * @param next
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token del header
  const secretKey = process.env.JWT_SECRET;
  const rutasExceptuadas = [
    '/usuarios/validar-inicio-sesion',
    '/configuraciones/existe-configuracion',
    '/usuarios/registrar-superusuario',
    '/configuraciones/registrar-configuracion',
    '/usuarios/recuperar-contrasena',
    '/usuarios/cambiar-contrasena'
  ];

  if (rutasExceptuadas.includes(req.path)) return next();

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  jwt.verify(token, secretKey, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: 'Token is invalid or expired' });
    }

    (req as any).decodedUser = decoded;

    next();
  });
};
