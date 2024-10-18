import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { logger } from '../../logger/CustomLogger';
import { TYPES } from '../types/types';
import { IProductosService } from '../interfaces/IProductosService';
import { IProductosRepository } from '../../repositories/ProductosRepository';
import { SpResult } from '../../models';
import { Producto } from '../../models/Producto';
import { FiltrosProductos } from '../../models/comandos/FiltroProductos';
import { TipoProducto } from '../../models/TipoProducto';
import { DetalleProducto } from '../../models/DetalleProducto';
import { FiltrosDetallesProductos } from '../../models/comandos/FiltroDetallesProductos';
import { MovimientoProducto } from '../../models/MovimientoProducto';

/**
 * Servicio que tiene como responsabilidad
 * lo vinculado a los proveedores
 */
@injectable()
export class ProductosService implements IProductosService {
  private readonly _productosRepository: IProductosRepository;

  constructor(
    @inject(TYPES.ProductosRepository)
    repository: IProductosRepository
  ) {
    this._productosRepository = repository;
  }

  public async registrarProducto(producto: Producto): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._productosRepository.registrarProducto(producto);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async modificarProducto(producto: Producto): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._productosRepository.modificarProducto(producto);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async consultarProductos(filtro: FiltrosProductos): Promise<Producto[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._productosRepository.consultarProductos(filtro);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async obtenerTipoProductos(): Promise<TipoProducto[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._productosRepository.obtenerTipoProductos();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async eliminarProducto(idProducto: number): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._productosRepository.eliminarProducto(idProducto);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async registrarDetalleProducto(detalle: DetalleProducto): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._productosRepository.registrarDetalleProducto(detalle);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async modificarDetalleProducto(detalle: DetalleProducto): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._productosRepository.modificarDetalleProducto(detalle);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async consultarDetallesProductos(filtro: FiltrosDetallesProductos): Promise<DetalleProducto[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._productosRepository.consultarDetallesProductos(filtro);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async eliminarDetalleProducto(idDetalleProducto: number): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._productosRepository.eliminarDetalleProducto(idDetalleProducto);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async consultarMovimientosPorProducto(idProducto: number): Promise<MovimientoProducto[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._productosRepository.consultarMovimientosPorProducto(idProducto);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }
}
