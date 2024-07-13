import { Request, Response } from 'express';
import { logger } from '../logger/CustomLogger';
import { HttpCodes, SpResult } from '../models';
import container from '../services/inversify.config';
import { TYPES } from '../services/types/types';
import { PromocionesService } from '../services/implementations/PromocionesService';
import { Promocion } from '../models/Promocion';
import { FiltrosPromociones } from '../models/comandos/FiltroPromociones';

const _promocionesService = container.get<PromocionesService>(TYPES.PromocionesService);

export async function registrarPromocion(request: Request, response: Response): Promise<Response> {
  const promocion: Promocion = request.body;

  return _promocionesService
    .registrarPromocion(promocion)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function consultarPromociones(request: Request, response: Response): Promise<Response> {
  const filtro: FiltrosPromociones = request.body;

  return _promocionesService
    .consultarPromociones(filtro)
    .then((x: Promocion[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function modificarPromocion(request: Request, response: Response): Promise<Response> {
  const promocion: Promocion = request.body;

  return _promocionesService
    .modificarPromocion(promocion)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function eliminarPromocion(request: Request, response: Response): Promise<Response> {
  const idPromocion: number = +request.params.id;

  return _promocionesService
    .eliminarPromocion(idPromocion)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export const PromocionesController = {
  registrarPromocion,
  consultarPromociones,
  modificarPromocion,
  eliminarPromocion
};
