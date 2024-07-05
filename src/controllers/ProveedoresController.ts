import { Request, Response } from 'express';
import { logger } from '../logger/CustomLogger';
import { HttpCodes, SpResult } from '../models';
import container from '../services/inversify.config';
import { TYPES } from '../services/types/types';
import { ProveedoresService } from '../services/implementations/ProveedoresService';
import { Proveedor } from '../models/Proveedor';

const _proveedoresService = container.get<ProveedoresService>(TYPES.ProveedoresService);

export async function registrarProveedor(request: Request, response: Response): Promise<Response> {
  const proveedor: Proveedor = request.body;

  return _proveedoresService
    .registrarProveedor(proveedor)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export const ProveedoresController = {
  registrarProveedor
};
