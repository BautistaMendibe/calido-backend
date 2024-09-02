import container from '../services/inversify.config';
import { TYPES } from '../services/types/types';
import { TransportesService } from '../services/implementations/TransportesService';
import { Request, Response } from 'express';
import { HttpCodes } from '../models';
import { logger } from '../logger/CustomLogger';
import { Transporte } from '../models/Transporte';

const _transportesService = container.get<TransportesService>(TYPES.TransportesService);

export async function obtenerTransportes(request: Request, response: Response): Promise<Response> {
  return _transportesService
    .obtenerTransportes()
    .then((x: Transporte[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export const TransportesController = {
  obtenerTransportes
};
