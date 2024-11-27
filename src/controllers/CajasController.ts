import container from '../services/inversify.config';
import { TYPES } from '../services/types/types';
import { Request, Response } from 'express';
import { HttpCodes, SpResult } from '../models';
import { logger } from '../logger/CustomLogger';
import { CajasService } from '../services/implementations/CajasService';
import { Caja } from '../models/Caja';
import { FiltrosCajas } from '../models/comandos/FiltroCaja';
import { Arqueo } from '../models/Arqueo';
import { FiltrosArqueos } from '../models/comandos/FiltroArqueo';
import { EstadoArqueo } from '../models/EstadoArqueo';
import { MovimientoManual } from '../models/MovimientoManual';

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

export async function registrarArqueo(request: Request, response: Response): Promise<Response> {
  const arqueo: Arqueo = request.body;

  return _cajasService
    .registrarArqueo(arqueo)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function consultarArqueos(request: Request, response: Response): Promise<Response> {
  const filtro: FiltrosArqueos = request.body;

  return _cajasService
    .consultarArqueos(filtro)
    .then((x: Arqueo[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function eliminarArqueo(request: Request, response: Response): Promise<Response> {
  const idArqueo: number = +request.params.id;

  return _cajasService
    .eliminarArqueo(idArqueo)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function modificarArqueo(request: Request, response: Response): Promise<Response> {
  const arqueo: Arqueo = request.body;

  return _cajasService
    .modificarArqueo(arqueo)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function obtenerEstadosArqueo(request: Request, response: Response): Promise<Response> {
  return _cajasService
    .obtenerEstadosArqueo()
    .then((x: EstadoArqueo[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function registrarMovimientoManual(request: Request, response: Response): Promise<Response> {
  const movimiento: MovimientoManual = request.body;

  return _cajasService
    .registrarMovimientoManual(movimiento)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function consultarMovimientosManuales(request: Request, response: Response): Promise<Response> {
  const idArqueo: number = +request.params.id;

  return _cajasService
    .consultarMovimientosManuales(idArqueo)
    .then((x: MovimientoManual[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function eliminarMovimientoManual(request: Request, response: Response): Promise<Response> {
  const idMovimiento: number = +request.params.id;

  return _cajasService
    .eliminarMovimientoManual(idMovimiento)
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
  modificarCaja,
  registrarArqueo,
  consultarArqueos,
  eliminarArqueo,
  modificarArqueo,
  obtenerEstadosArqueo,
  registrarMovimientoManual,
  consultarMovimientosManuales,
  eliminarMovimientoManual
};
