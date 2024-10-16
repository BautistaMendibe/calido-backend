import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { logger } from '../../logger/CustomLogger';
import { TYPES } from '../types/types';
import { IPromocionesService } from '../interfaces/IPromocionesService';
import { IPromocionesRepository } from '../../repositories/PromocionesRepository';
import { Promocion } from '../../models/Promocion';
import { SpResult } from '../../models';
import { FiltrosPromociones } from '../../models/comandos/FiltroPromociones';
import { Producto } from '../../models/Producto';
import PoolDb from '../../data/db';
import { buscarPromocionPorProducto } from '../../controllers/PromocionesController';

/**
 * Servicio que tiene como responsabilidad
 * lo vinculado a los promociones
 */
@injectable()
export class PromocionesService implements IPromocionesService {
  private readonly _promocionesRepository: IPromocionesRepository;

  constructor(
    @inject(TYPES.PromocionesRepository)
    repository: IPromocionesRepository
  ) {
    this._promocionesRepository = repository;
  }

  public async registrarPromocion(promocion: Promocion): Promise<SpResult> {
    const client = await PoolDb.connect();
    return new Promise(async (resolve, reject) => {
      try {
        await client.query('BEGIN');
        const result = await this._promocionesRepository.registrarPromocion(promocion, client);
        const promocionId = result.id;
        for (const producto of promocion.productos) {
          const detallePromocion: SpResult = await this._promocionesRepository.registrarDetallePromocion(promocionId, producto, client);
          if (detallePromocion.mensaje != 'OK') {
            throw new Error('Error al registrar el detalle de la promocion.');
          }
        }
        await client.query('COMMIT');
        resolve(result);
      } catch (e) {
        await client.query('ROLLBACK');
        logger.error(e);
        reject(e);
      } finally {
        client.release();
      }
    });
  }

  public async consultarPromociones(filtro: FiltrosPromociones): Promise<Promocion[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const promociones = await this._promocionesRepository.consultarPromociones(filtro);
        const result: Promocion[] = await Promise.all(
          promociones.map(async (promocion) => {
            promocion.productos = await this._promocionesRepository.buscarProductosPorPromocion(promocion.id);
            return promocion;
          })
        );
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async modificarPromocion(promocion: Promocion): Promise<SpResult> {
    const client = await PoolDb.connect();
    return new Promise(async (resolve, reject) => {
      await client.query('BEGIN');
      try {
        const result = await this._promocionesRepository.modificarPromocion(promocion, client);
        for (const producto of promocion.productos) {
          const detallePromocion: SpResult = await this._promocionesRepository.modificarDetallePromocion(promocion.id, producto.id, client);
          if (detallePromocion.mensaje != 'OK') {
            throw new Error('Error al modificar el detalle de la promocion.');
          }
        }
        await client.query('COMMIT');
        resolve(result);
      } catch (e) {
        await client.query('ROLLBACK');
        logger.error(e);
        reject(e);
      } finally {
        client.release();
      }
    });
  }

  public async eliminarPromocion(idPromocion: number): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._promocionesRepository.eliminarPromocion(idPromocion);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async buscarProductos(): Promise<Producto[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._promocionesRepository.buscarProductos();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async buscarProducto(idProducto: number): Promise<Producto> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._promocionesRepository.buscarProducto(idProducto);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async notificarPromocion(imagen: string, comentario: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._promocionesRepository.notificarPromocion(imagen, comentario);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async buscarPromocionPorProducto(idProducto: number): Promise<Promocion[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._promocionesRepository.buscarPromocionPorProducto(idProducto);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }
}
