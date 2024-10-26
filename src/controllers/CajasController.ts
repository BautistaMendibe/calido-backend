import container from '../services/inversify.config';
import { TYPES } from '../services/types/types';
import { Request, Response } from 'express';
import { HttpCodes, SpResult } from '../models';
import { logger } from '../logger/CustomLogger';
import { CajasService } from '../services/implementations/CajasService';
import { Caja } from '../models/Caja';
import { FiltrosCajas } from '../models/comandos/FiltroCaja';

const _cajasService = container.get<CajasService>(TYPES.CajasService);

export async function registrarCaja(request: Request, response: Response): Promise<Response> {
  const caja: Caja = request.body;

  return _cajasService
    .registrarCaja(caja)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function consultarCajas(request: Request, response: Response): Promise<Response> {
  const filtro: FiltrosCajas = request.body;

  return _cajasService
    .consultarCajas(filtro)
    .then((x: Caja[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function eliminarCaja(request: Request, response: Response): Promise<Response> {
  const idCaja: number = +request.params.id;

  return _cajasService
    .eliminarCaja(idCaja)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function modificarCaja(request: Request, response: Response): Promise<Response> {
  const caja: Caja = request.body;

  return _cajasService
    .modificarCaja(caja)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export const CajasController = {
  registrarCaja,
  consultarCajas,
  eliminarCaja,
  modificarCaja
};
