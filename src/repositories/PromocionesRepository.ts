import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import { SpResult } from '../models';
import PoolDb from '../data/db';
import { plainToClass } from 'class-transformer';
import { Promocion } from '../models/Promocion';
import { FiltrosPromociones } from '../models/comandos/FiltroPromociones';
import { Producto } from '../models/Producto';

/**
 * Interfaz del repositorio de Promociones
 */
export interface IPromocionesRepository {
  registrarPromocion(promocion: Promocion): Promise<SpResult>;
  consultarPromociones(filtro: FiltrosPromociones): Promise<Promocion[]>;
  modificarPromocion(promocion: Promocion): Promise<SpResult>;
  eliminarPromocion(idPromocion: number): Promise<SpResult>;
  buscarProductos(): Promise<Producto[]>;
  buscarProducto(idProducto: number): Promise<Producto>;
}

/**
 * Repositorio de alta, modificacion y consultas de promociones
 */
@injectable()
export class PromocionesRepository implements IPromocionesRepository {
  /**
   * Método asíncrono para registar una promoción
   * @param {Promocion} promocion
   * @returns {SpResult}
   */
  async registrarPromocion(promocion: Promocion): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [promocion.nombre, promocion.porcentajeDescuento, promocion.idProducto];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_PROMOCION_PRODUCTO($1, $2, $3)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al registrar Promocion: ' + err);
      throw new Error('Error al registrar Promocion.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para consultar promociones
   * @param {FiltrosPromociones} filtros de busqueda
   * @returns {Promocion []} arreglo de promociones
   */
  async consultarPromociones(filtro: FiltrosPromociones): Promise<Promocion[]> {
    const client = await PoolDb.connect();

    const nombre = filtro.nombre;
    const params = [nombre];
    try {
      const res = await client.query<Promocion[]>('SELECT * FROM PUBLIC.BUSCAR_PROMOCIONES_PRODUCTO($1)', params);
      const result: Promocion[] = plainToClass(Promocion, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al consultar Promociones: ' + err);
      throw new Error('Error al consultar Promociones.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para modificar los datos de una promoción
   * @param {Promocion} promocion
   * @returns {SpResult}
   */
  async modificarPromocion(promocion: Promocion): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [promocion.id, promocion.nombre, promocion.porcentajeDescuento, promocion.idProducto];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.MODIFICAR_PROMOCION_PRODUCTO($1, $2, $3, $4)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al modificar la promoción: ' + err);
      throw new Error('Error al modificar la promoción.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para eliminar una promoción
   * @param {id} number id de promoción
   * @returns {SpResult}
   */
  async eliminarPromocion(idPromocion: number): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [idPromocion];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.ELIMINAR_PROMOCION_PRODUCTO($1)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al eliminar la promocion: ' + err);
      throw new Error('Error al eliminar la promocion.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para consultar los productos
   * @returns {Producto[]}
   */
  async buscarProductos(): Promise<Producto[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<Producto[]>('SELECT * FROM PUBLIC.PRODUCTO');
      const result: Producto[] = plainToClass(Producto, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al eliminar el producto: ' + err);
      throw new Error('Error al eliminar el producto.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para obtener un producto segun su id
   * @param {idProducto} number id del Producto
   * @returns {Producto}
   */
  async buscarProducto(idProducto: number): Promise<Producto> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<Producto>(`SELECT * FROM PUBLIC.PRODUCTO WHERE idproducto = ${idProducto}`);
      const result: Producto = plainToClass(Producto, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al eliminar el producto: ' + err);
      throw new Error('Error al eliminar el producto.');
    } finally {
      client.release();
    }
  }
}
