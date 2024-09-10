import { Request, Response } from 'express';
import { logger } from '../logger/CustomLogger';
import { HttpCodes } from '../models';
import container from '../services/inversify.config';
import { TYPES } from '../services/types/types';
import { DomicilioService } from '../services/implementations/DomicilioService';
import { Provincia } from '../models/Provincia';
import { Localidad } from '../models/Localidad';

const _domicilioService = container.get<DomicilioService>(TYPES.DomicilioService);

export async function obtenerProvincias(request: Request, response: Response): Promise<Response> {
  return _domicilioService
    .obtenerProvincias()
    .then((x: Provincia[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function obtenerLocalidadesPorProvincia(request: Request, response: Response): Promise<Response> {
  const idProvincia: number = +request.params.idProvincia;

  return _domicilioService
    .obtenerLocalidadesPorProvincia(idProvincia)
    .then((x: Localidad[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export const DomicilioController = {
  obtenerProvincias,
  obtenerLocalidadesPorProvincia
};
