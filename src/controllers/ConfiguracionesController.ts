import { Request, Response } from 'express';
import { logger } from '../logger/CustomLogger';
import { HttpCodes, SpResult } from '../models';
import container from '../services/inversify.config';
import { TYPES } from '../services/types/types';
import { ConfiguracionesService } from '../services/implementations/ConfiguracionesService';
import { Configuracion } from '../models/Configuracion';

const _configuracionesService = container.get<ConfiguracionesService>(TYPES.ConfiguracionesService);

export async function obtenerConfiguraciones(request: Request, response: Response): Promise<Response> {
  return _configuracionesService
    .obtenerConfiguraciones()
    .then((x: Configuracion) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function registrarConfiguracion(request: Request, response: Response): Promise<Response> {
  return _configuracionesService
    .registrarConfiguracion()
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function modificarConfiguracion(request: Request, response: Response): Promise<Response> {
  const configuracion: Configuracion = request.body;

  return _configuracionesService
    .modificarConfiguracion(configuracion)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function existeConfiguracion(request: Request, response: Response): Promise<Response> {
  return _configuracionesService
    .existeConfiguracion()
    .then((x: boolean) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function obtenerSuperusuario(request: Request, response: Response): Promise<Response> {
  return _configuracionesService
    .obtenerSuperusuario()
    .then((x: string) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export const ConfiguracionesController = {
  obtenerConfiguraciones,
  registrarConfiguracion,
  modificarConfiguracion,
  existeConfiguracion,
  obtenerSuperusuario
};
