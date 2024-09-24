import container from '../services/inversify.config';
import { TYPES } from '../services/types/types';
import { Request, Response } from 'express';
import { HttpCodes, SpResult } from '../models';
import { logger } from '../logger/CustomLogger';
import { PedidosService } from '../services/implementations/PedidosService';
import { Pedido } from '../models/Pedido';
import { FiltroPedidos } from '../models/comandos/FiltroPedidos';
import { EstadoPedido } from '../models/EstadoPedido';

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

export async function consultarPedidos(request: Request, response: Response): Promise<Response> {
  const filtro: FiltroPedidos = request.body;

  return _pedidosService
    .consultarPedidos(filtro)
    .then((x: Pedido[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function eliminarPedido(request: Request, response: Response): Promise<Response> {
  const idPedido: number = +request.params.id;

  return _pedidosService
    .eliminarPedido(idPedido)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function obtenerEstadosPedido(request: Request, response: Response): Promise<Response> {
  return _pedidosService
    .obtenerEstadosPedido()
    .then((x: EstadoPedido[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function modificarPedido(request: Request, response: Response): Promise<Response> {
  const pedido: Pedido = request.body;

  return _pedidosService
    .modificarPedido(pedido)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export const PedidosController = {
  registrarPedido,
  consultarPedidos,
  eliminarPedido,
  obtenerEstadosPedido,
  modificarPedido
};
