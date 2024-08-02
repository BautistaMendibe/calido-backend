import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import { SpResult } from '../models';
import PoolDb from '../data/db';
import { plainToClass } from 'class-transformer';
import { Producto } from '../models/Producto';
import { FiltrosProductos } from '../models/comandos/FiltroProductos';
import { Proveedor } from '../models/Proveedor';
import { TipoProducto } from '../models/TipoProducto';
import { Marca } from '../models/Marca';

/**
 * Interfaz del repositorio de Proveedores
 */
export interface IProductosRepository {
  registrarProducto(producto: Producto): Promise<SpResult>;
  consultarProductos(filtro: FiltrosProductos): Promise<Producto[]>;
  obtenerTipoProductos(): Promise<TipoProducto[]>;
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
    const params = [
      producto.nombre,
      producto.costo,
      producto.costoIva,
      producto.tipoProducto.id ? producto.tipoProducto.id : null,
      producto.tipoProducto.nombre,
      producto.proveedor.id,
      producto.marca.id ? producto.marca.id : null,
      producto.marca.nombre
    ];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REG_PRODUCTO($1, $2, $3, $4, $5, $6, $7, $8)', params);
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

    // Convertir las propiedades del filtro a tipos apropiados, asumiendo que valores vacíos son null
    const id = filtro.id ? parseInt(String(filtro.id), 10) : null;
    const nombre = filtro.nombre || null;
    const marca = filtro.marca ? parseInt(String(filtro.marca), 10) : null;
    const tipoProducto = filtro.tipoProducto ? parseInt(String(filtro.tipoProducto), 10) : null;
    const proveedor = filtro.proveedor ? parseInt(String(filtro.proveedor), 10) : null;

    const params = [id, nombre, marca, tipoProducto, proveedor];

    try {
      const res = await client.query<Producto[]>('SELECT * FROM public.buscar_productos($1, $2, $3, $4, $5)', params);

      const productos = res.rows.map((row: any) => {
        // Armamos los objetos necesarios para la clase Proveedor
        const tipoProducto: TipoProducto = plainToClass(
          TipoProducto,
          {
            idtipoproducto: row.idtipoproducto,
            ntipoproducto: row.ntipoproducto
          },
          { excludeExtraneousValues: true }
        );

        const marca: Marca = plainToClass(
          Marca,
          {
            idmarca: row.idmarca,
            nmarca: row.nmarca
          },
          { excludeExtraneousValues: true }
        );

        const proveedor: Proveedor = plainToClass(
          Proveedor,
          {
            idproveedor: row.idproveedor,
            nproveedor: row.nproveedor
          },
          { excludeExtraneousValues: true }
        );

        return new Producto(row.idproducto, row.nproducto, row.preciocosto, row.preciocostoiva, tipoProducto, marca, proveedor);
      });

      return productos;
    } catch (err) {
      logger.error('Error al consultar Productos: ' + err);
      throw new Error('Error al consultar Productos.');
    } finally {
      client.release();
    }
  }

  async obtenerTipoProductos(): Promise<TipoProducto[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<TipoProducto[]>('SELECT * FROM PUBLIC.TIPO_PRODUCTO');
      const result: TipoProducto[] = plainToClass(TipoProducto, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al consultar Tipo de Producto: ' + err);
      throw new Error('Error al consultar Tipo de Producto.');
    } finally {
      client.release();
    }
  }
}
