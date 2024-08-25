import { Request, Response } from 'express';
import { logger } from '../logger/CustomLogger';
import { HttpCodes, SpResult } from '../models';
import container from '../services/inversify.config';
import { TYPES } from '../services/types/types';
import { VentasService } from '../services/implementations/VentasService';
import { Venta } from '../models/Venta';
import { Usuario } from '../models/Usuario';
import { FormaDePago } from '../models/FormaDePago';

const _ventasService = container.get<VentasService>(TYPES.VentasService);

export async function registrarVenta(request: Request, response: Response): Promise<Response> {
  const venta: Venta = request.body;

  return _ventasService
    .registrarVenta(venta)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function buscarUsuariosClientes(request: Request, response: Response): Promise<Response> {
  return _ventasService
    .buscarUsuariosClientes()
    .then((x: Usuario[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function buscarFormasDePago(request: Request, response: Response): Promise<Response> {
  return _ventasService
    .buscarFormasDePago()
    .then((x: FormaDePago[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export const VentasController = {
  registrarVenta,
  buscarUsuariosClientes,
  buscarFormasDePago
};
