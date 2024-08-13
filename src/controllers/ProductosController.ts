import { Request, Response } from 'express';
import { logger } from '../logger/CustomLogger';
import { HttpCodes, SpResult } from '../models';
import container from '../services/inversify.config';
import { TYPES } from '../services/types/types';
import { ProductosService } from '../services/implementations/ProductosService';
import { Producto } from '../models/Producto';
import { FiltrosProductos } from '../models/comandos/FiltroProductos';
import { TipoProducto } from '../models/TipoProducto';

const _productosService = container.get<ProductosService>(TYPES.ProductosService);

export async function consultarProductos(request: Request, response: Response): Promise<Response> {
  const filtro: FiltrosProductos = request.body;

  return _productosService
    .consultarProductos(filtro)
    .then((x: Producto[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function consultarTipoProductos(request: Request, response: Response): Promise<Response> {
  return _productosService
    .obtenerTipoProductos()
    .then((x: TipoProducto[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function registrarProducto(request: Request, response: Response): Promise<Response> {
  const producto: Producto = request.body;

  return _productosService
    .registrarProducto(producto)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function modificarProducto(request: Request, response: Response): Promise<Response> {
  const producto: Producto = request.body;

  return _productosService
    .modificarProducto(producto)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function eliminarProducto(request: Request, response: Response): Promise<Response> {
  const idProducto: number = +request.params.id;

  return _productosService
    .eliminarProducto(idProducto)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export const ProductosController = {
  consultarProductos,
  consultarTipoProductos,
  registrarProducto,
  modificarProducto,
  eliminarProducto
};
