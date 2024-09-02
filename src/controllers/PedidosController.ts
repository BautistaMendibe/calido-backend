import container from '../services/inversify.config';
import { TYPES } from '../services/types/types';
import { Request, Response } from 'express';
import { HttpCodes, SpResult } from '../models';
import { logger } from '../logger/CustomLogger';
import { PedidosService } from '../services/implementations/PedidosService';
import { Pedido } from '../models/Pedido';

const _pedidosService = container.get<PedidosService>(TYPES.PedidosService);

export async function registrarPedido(request: Request, response: Response): Promise<Response> {
  const pedido: Pedido = request.body;

  return _pedidosService
    .registrarPedido(pedido)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export const PedidosController = {
  registrarPedido
};
