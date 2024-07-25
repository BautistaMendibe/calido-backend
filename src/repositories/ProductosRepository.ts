import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import { SpResult } from '../models';
import PoolDb from '../data/db';
import { plainToClass } from 'class-transformer';
import { Producto } from '../models/Producto';
import { consultarProductos } from '../controllers/ProductosController';
import { FiltrosProductos } from '../models/comandos/FiltroProductos';

/**
 * Interfaz del repositorio de Proveedores
 */
export interface IProductosRepository {
  registrarProducto(producto: Producto): Promise<SpResult>;
  consultarProductos(filtro: FiltrosProductos): Promise<Producto[]>;
}

/**
 * Repositorio de alta, modificacion y consultas de proveedores
 */
@injectable()
export class ProductosRepository implements IProductosRepository {
  /**
   * Método asíncrono para registar un proveedor
   * @param {Producto} producto
   * @returns {SpResult}
   */
  async registrarProducto(producto: Producto): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [producto.nombre, producto.costo, producto.costoIva, producto.tipoProducto.id, producto.proveedor.id, producto.marca.id];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_PRODUCTO($1, $2, $3, $4, $5, $6)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al registrar Producto: ' + err);
      throw new Error('Error al registrar Producto.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para consultar proveedores
   * @param {FiltrosProductos} filtros de busqueda
   * @returns {Producto []} arreglo de proveedores
   */
  async consultarProductos(filtro: FiltrosProductos): Promise<Producto[]> {
    const client = await PoolDb.connect();

    const id: number = filtro.id;
    const nombre = filtro.nombre;
    const marca: number = filtro.marca;
    const tipoProducto: number = filtro.tipoProducto;
    const proveedor: number = filtro.proveedor;
    const params = [id, nombre, marca, tipoProducto, proveedor];
    try {
      const res = await client.query<Producto[]>('SELECT * FROM PUBLIC.BUSCAR_PRODUCTOS($1,$2,$3,$4,$5)', params);
      const result: Producto[] = plainToClass(Producto, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al consultar Productos: ' + err);
      throw new Error('Error al consultar Productos.');
    } finally {
      client.release();
    }
  }
}
