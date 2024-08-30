import { Request, Response, NextFunction } from 'express';

export const requireAdminRole = (req: Request, res: Response, next: NextFunction) => {
  const rutasProhibidas = ['/test/test']; // TODO: Agregar rutas que requieran rol de administrador

  if (rutasProhibidas.includes(req.path)) {
    const decodedUser = (req as any).decodedUser;

    if (!decodedUser || !decodedUser.roles || !decodedUser.roles.includes('Administrador')) {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
  }

  next();
};
