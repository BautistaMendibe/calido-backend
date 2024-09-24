import container from '../services/inversify.config';
import { TYPES } from '../services/types/types';
import { Request, Response } from 'express';
import { HttpCodes, SpResult } from '../models';
import { logger } from '../logger/CustomLogger';
import { ComprobantesService } from '../services/implementations/ComprobantesService';
import { Comprobante } from '../models/Comprobante';
import { FiltrosComprobantes } from '../models/comandos/FiltroComprobantes';
import { TipoComprobante } from '../models/TipoComprobante';

const _comprobantesService = container.get<ComprobantesService>(TYPES.ComprobantesService);

export async function registrarComprobante(request: Request, response: Response): Promise<Response> {
  const comprobante: Comprobante = request.body;

  return _comprobantesService
    .registrarComprobante(comprobante)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function consultarComprobantes(request: Request, response: Response): Promise<Response> {
  const filtro: FiltrosComprobantes = request.body;

  return _comprobantesService
    .consultarComprobantes(filtro)
    .then((x: Comprobante[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function eliminarComprobante(request: Request, response: Response): Promise<Response> {
  const idComprobante: number = +request.params.id;

  return _comprobantesService
    .eliminarComprobante(idComprobante)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function obtenerTiposComprobantes(request: Request, response: Response): Promise<Response> {
  return _comprobantesService
    .obtenerTiposComprobantes()
    .then((x: TipoComprobante[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function modificarComprobante(request: Request, response: Response): Promise<Response> {
  const comprobante: Comprobante = request.body;

  return _comprobantesService
    .modificarComprobante(comprobante)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export const ComprobantesController = {
  registrarComprobante,
  consultarComprobantes,
  eliminarComprobante,
  obtenerTiposComprobantes,
  modificarComprobante
};
