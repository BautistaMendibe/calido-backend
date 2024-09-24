import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { logger } from '../../logger/CustomLogger';
import { TYPES } from '../types/types';
import { IProductosService } from '../interfaces/IProductosService';
import { IProductosRepository } from '../../repositories/ProductosRepository';
import { SpResult } from '../../models';
import { Producto } from '../../models/Producto';
import { FiltrosProductos } from '../../models/comandos/FiltroProductos';
import { Marca } from '../../models/Marca';
import { TipoProducto } from '../../models/TipoProducto';
import { Proveedor } from '../../models/Proveedor';

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
}
