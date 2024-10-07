import container from '../services/inversify.config';
import { TYPES } from '../services/types/types';
import { Request, Response } from 'express';
import { HttpCodes, SpResult } from '../models';
import { logger } from '../logger/CustomLogger';
import { TarjetasService } from '../services/implementations/TarjetasService';
import { Tarjeta } from '../models/Tarjeta';
import { FiltrosTarjetas } from '../models/comandos/FiltroTarjetas';
import { TipoTarjeta } from '../models/TipoTarjeta';
import { Cuota } from '../models/Cuota';

const _tarjetasService = container.get<TarjetasService>(TYPES.TarjetasService);

export async function registrarTarjeta(request: Request, response: Response): Promise<Response> {
  const tarjeta: Tarjeta = request.body;

  return _tarjetasService
    .registrarTarjeta(tarjeta)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function consultarTarjetas(request: Request, response: Response): Promise<Response> {
  const filtro: FiltrosTarjetas = request.body;

  return _tarjetasService
    .consultarTarjetas(filtro)
    .then((x: Tarjeta[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function eliminarTarjeta(request: Request, response: Response): Promise<Response> {
  const idTarjeta: number = +request.params.id;

  return _tarjetasService
    .eliminarTarjeta(idTarjeta)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function buscarTiposTarjetas(request: Request, response: Response): Promise<Response> {
  return _tarjetasService
    .buscarTiposTarjetas()
    .then((x: TipoTarjeta[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function consultarCuotas(request: Request, response: Response): Promise<Response> {
  return _tarjetasService
    .consultarCuotas()
    .then((x: Cuota[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function modificarTarjeta(request: Request, response: Response): Promise<Response> {
  const tarjeta: Tarjeta = request.body;

  return _tarjetasService
    .modificarTarjeta(tarjeta)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export const TarjetasController = {
  registrarTarjeta,
  consultarTarjetas,
  eliminarTarjeta,
  buscarTiposTarjetas,
  modificarTarjeta,
  consultarCuotas
};
