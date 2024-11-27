import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import { SpResult } from '../models';
import PoolDb from '../data/db';
import { plainToClass } from 'class-transformer';
import { Promocion } from '../models/Promocion';
import { FiltrosPromociones } from '../models/comandos/FiltroPromociones';
import { Producto } from '../models/Producto';
import { IgApiClient } from 'instagram-private-api';
import { promisify } from 'util';
import { readFile } from 'fs';
import path from 'node:path';
import { PoolClient } from 'pg';

/**
 * Interfaz del repositorio de Promociones
 */
export interface IPromocionesRepository {
  registrarPromocion(promocion: Promocion, client: PoolClient): Promise<SpResult>;
  registrarDetallePromocion(promocionId: number, producto: Producto, client: PoolClient): Promise<SpResult>;
  consultarPromociones(filtro: FiltrosPromociones): Promise<Promocion[]>;
  buscarProductosPorPromocion(idPromocion: number): Promise<Producto[]>;
  modificarPromocion(promocion: Promocion, client: PoolClient): Promise<SpResult>;
  modificarDetallePromocion(idPromocion: number, idProducto: number, esEliminar: boolean, client: PoolClient): Promise<SpResult>;
  eliminarPromocion(idPromocion: number): Promise<SpResult>;
  buscarProductos(): Promise<Producto[]>;
  buscarProducto(idProducto: number): Promise<Producto>;
  notificarPromocion(imagen: string, comentario: string): Promise<string>;
  buscarPromocionPorProducto(idProducto: number): Promise<Promocion[]>;
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
  async registrarPromocion(promocion: Promocion, client: PoolClient): Promise<SpResult> {
    const params = [promocion.nombre, promocion.porcentajeDescuento];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_PROMOCION_PRODUCTO($1, $2)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al registrar Promocion: ' + err);
      throw new Error('Error al registrar Promocion.');
    }
  }

  /**
   * Método asíncrono para registar el detalle de una promocion
   * @param {idPromocion} number
   * @param {producto} Producto
   * @returns {SpResult}
   */
  async registrarDetallePromocion(promocionId: number, producto: Producto, client: PoolClient): Promise<SpResult> {
    const params = [promocionId, producto.id];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTAR_DETALLE_PROMOCION($1, $2)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al registrar detalle de Promocion: ' + err);
      throw new Error('Error al registrar detalle de Promocion.');
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
   * Método asíncrono para consultar los productos de una determinada promocion
   * @param {idPromocion}
   * @returns {Producto []}
   */
  async buscarProductosPorPromocion(idPromocion: number): Promise<Producto[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<Producto[]>(`SELECT p.* FROM producto p WHERE p.idpromocionproducto = ${idPromocion}`);
      const result: Producto[] = plainToClass(Producto, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al consultar productos por Promociones: ' + err);
      throw new Error('Error al consultar productos por Promociones.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para modificar los datos de una promoción
   * @param {Promocion} promocion
   * @returns {SpResult}
   */
  async modificarPromocion(promocion: Promocion, client: PoolClient): Promise<SpResult> {
    const params = [promocion.id, promocion.nombre, promocion.porcentajeDescuento];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.MODIFICAR_PROMOCION_PRODUCTO($1, $2, $3)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al modificar la promoción: ' + err);
      throw new Error('Error al modificar la promoción.');
    }
  }

  /**
   * Método asíncrono para modificar el detalle de una promocion
   * @param {idPromocion} number
   * @param {idProducto} number
   * @returns {SpResult}
   */
  async modificarDetallePromocion(idPromocion: number, idProducto: number, esEliminar: boolean, client: PoolClient): Promise<SpResult> {
    const params = [idPromocion, idProducto, esEliminar];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.MODIFICAR_DETALLE_PROMOCION($1, $2, $3)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al modificar el detalle de promoción: ' + err);
      throw new Error('Error al modificar el detalle de promoción.');
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
      const res = await client.query<Producto[]>(
        'SELECT p.*, dp.canteninventario FROM PUBLIC.PRODUCTO p LEFT JOIN PUBLIC.DETALLE_PRODUCTO dp ON p.idproducto = dp.idproducto AND dp.activo = 1 WHERE p.activo = 1'
      );
      const result: Producto[] = plainToClass(Producto, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al buscar el producto: ' + err);
      throw new Error('Error al buscar el producto.');
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
      const res = await client.query<Producto>(`SELECT * FROM PUBLIC.PRODUCTO WHERE idproducto = ${idProducto} AND activo = 1`);
      const result: Producto = plainToClass(Producto, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al buscar el producto: ' + err);
      throw new Error('Error al buscar el producto.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para notificar una promoción en Instagram
   * @param {string} imagen - Localización de imágen en backend para publicar.
   * @param {string} comentario - Comentario para publicar.
   * @returns {Promise<string>}
   */
  async notificarPromocion(nombreImagen: string, comentario: string): Promise<string> {
    const client = await PoolDb.connect();

    try {
      // Consultar la configuración para obtener las credenciales de Instagram
      const res = await client.query('SELECT usuario_ig, contrasena_ig FROM public.configuracion LIMIT 1');
      const configuracion = res.rows[0];

      if (!configuracion || !configuracion.usuario_ig || !configuracion.contrasena_ig) {
        logger.error('No existe contraseña o usuario en la configuración.');
        throw new Error('Usuario o configuración no existe en la configuración.');
      }

      const usuario_ig = configuracion['usuario_ig'];
      const contrasena_ig = configuracion['contrasena_ig'];

      // Autenticarse en Instagram
      const ig = new IgApiClient();
      ig.state.generateDevice(usuario_ig);
      await ig.account.login(usuario_ig, contrasena_ig);

      // Publicar la imagen en Instagram
      const readFileAsync = promisify(readFile);
      const pathImage = path.join(process.cwd(), 'src', 'assets', 'imgs', 'instagram', nombreImagen);

      const publishResult = await ig.publish.photo({
        file: await readFileAsync(pathImage),
        caption: comentario
      });

      return publishResult.status.toUpperCase();
    } catch (err) {
      logger.error('Error al consultar usuario y contraseña de base de datos: ' + err);
      throw new Error('Error al consultar usuario y contraseña de base de datos.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para obtener las promociones que tiene un producto
   * @param {idProducto} number id del Producto
   * @returns {Promocion}
   */
  async buscarPromocionPorProducto(idProducto: number): Promise<Promocion[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<Promocion[]>(
        `SELECT promocion.* FROM producto p JOIN promocion_producto promocion ON p.idproducto = ${idProducto} WHERE p.idpromocionproducto = promocion.idpromocionproducto`
      );
      const result: Promocion[] = plainToClass(Promocion, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al consultar promociones por producto: ' + err);
      throw new Error('Error al consultar promociones por producto.');
    } finally {
      client.release();
    }
  }
}
