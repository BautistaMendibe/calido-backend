import { Request, Response } from 'express';
import { logger } from '../logger/CustomLogger';
import { HttpCodes, SpResult } from '../models';
import container from '../services/inversify.config';
import { TYPES } from '../services/types/types';
import { MarcaService } from '../services/implementations/MarcaService';
import { Marca } from '../models/Marca';

const _marcaService = container.get<MarcaService>(TYPES.MarcasService);

export async function obtenerMarcas(request: Request, response: Response): Promise<Response> {
  return _marcaService
    .obtenerMarcas()
    .then((x: Marca[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export const MarcasController = {
  obtenerMarcas
};
