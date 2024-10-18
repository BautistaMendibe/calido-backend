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
import { FiltrosDetallesProductos } from '../models/comandos/FiltroDetallesProductos';
import { DetalleProducto } from '../models/DetalleProducto';
import { MovimientoProducto } from '../models/MovimientoProducto';

/**
 * Interfaz del repositorio de Proveedores
 */
export interface IProductosRepository {
  registrarProducto(producto: Producto): Promise<SpResult>;
  consultarProductos(filtro: FiltrosProductos): Promise<Producto[]>;
  obtenerTipoProductos(): Promise<TipoProducto[]>;
  modificarProducto(producto: Producto): Promise<SpResult>;
  eliminarProducto(idProducto: number): Promise<SpResult>;
  consultarDetallesProductos(filtro: FiltrosDetallesProductos): Promise<DetalleProducto[]>;
  registrarDetalleProducto(detalle: DetalleProducto): Promise<SpResult>;
  eliminarDetalleProducto(idDetalleProducto: number): Promise<SpResult>;
  modificarDetalleProducto(detalle: DetalleProducto): Promise<SpResult>;
  consultarMovimientosPorProducto(idProducto: number): Promise<MovimientoProducto[]>;
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
      producto.precioSinIVA,
      producto.tipoProducto.id ? producto.tipoProducto.id : null,
      producto.tipoProducto.nombre,
      producto.proveedor.id,
      producto.marca.id ? producto.marca.id : null,
      producto.marca.nombre,
      producto.codigoBarra,
      producto.descripcion,
      producto.imgProducto,
      producto.margenGanancia
    ];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REG_PRODUCTO($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', params);
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

        const producto = new Producto(
          row.idproducto,
          row.nproducto,
          row.preciocosto,
          row.preciosiniva,
          row.imgproducto,
          row.codigobarra,
          row.descripcion,
          tipoProducto,
          marca,
          proveedor
        );
        producto.margenGanancia = row.margenganancia;

        return producto;
      });

      return productos;
    } catch (err) {
      logger.error('Error al consultar Productos: ' + err);
      throw new Error('Error al consultar Productos.');
    } finally {
      client.release();
    }
  }

  async modificarProducto(producto: Producto): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [
      producto.id,
      producto.nombre,
      producto.costo,
      producto.precioSinIVA,
      producto.tipoProducto.id ? producto.tipoProducto.id : null,
      producto.tipoProducto.nombre,
      producto.proveedor.id,
      producto.marca.id ? producto.marca.id : null,
      producto.marca.nombre,
      producto.codigoBarra,
      producto.descripcion,
      producto.imgProducto,
      producto.margenGanancia
    ];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.MODIFICAR_PRODUCTO($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al modificar el Producto: ' + err);
      throw new Error('Error al modificar el Producto.');
    } finally {
      client.release();
    }
  }

  async obtenerTipoProductos(): Promise<TipoProducto[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<TipoProducto[]>('SELECT * FROM PUBLIC.TIPO_PRODUCTO t WHERE t.activo = 1');
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

  async eliminarProducto(idProducto: number): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [idProducto];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.ELIMINAR_PRODUCTO($1)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al eliminar producto: ' + err);
      throw new Error('Error al eliminar producto.');
    } finally {
      client.release();
    }
  }

  async consultarDetallesProductos(filtro: FiltrosDetallesProductos): Promise<DetalleProducto[]> {
    const client = await PoolDb.connect();

    const producto = filtro.producto || null;
    const proveedor = filtro.proveedor || null;

    const params = [producto, proveedor];

    try {
      const res = await client.query<DetalleProducto[]>('SELECT * FROM public.BUSCAR_DETALLES_PRODUCTOS($1, $2)', params);

      const detallesProductos: DetalleProducto[] = res.rows.map((row: any) => {
        const producto: Producto = plainToClass(Producto, row, { excludeExtraneousValues: true });
        const proveedor: Proveedor = plainToClass(Proveedor, row, { excludeExtraneousValues: true });
        const marca: Marca = plainToClass(Marca, row, { excludeExtraneousValues: true });

        // Mapeamos el detalleProductos
        const detalleProducto: DetalleProducto = plainToClass(DetalleProducto, row, { excludeExtraneousValues: true });

        // Establecemos las relaciones del detalle producto
        detalleProducto.producto = producto;
        detalleProducto.proveedor = proveedor;
        producto.marca = marca;

        return detalleProducto;
      });

      return detallesProductos;
    } catch (err) {
      logger.error('Error al consultar Detalles Productos: ' + err);
      throw new Error('Error al consultar Detalles Productos.');
    } finally {
      client.release();
    }
  }

  async registrarDetalleProducto(detalle: DetalleProducto): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [detalle.cantEnInventario, detalle.idProducto];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_DETALLE_PRODUCTO($1, $2)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al registrar Detalle Producto: ' + err);
      throw new Error('Error al registrar Detalle Producto.');
    } finally {
      client.release();
    }
  }

  async eliminarDetalleProducto(idDetalleProducto: number): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [idDetalleProducto];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.ELIMINAR_DETALLE_PRODUCTO($1)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al eliminar detalle producto: ' + err);
      throw new Error('Error al eliminar detalle producto.');
    } finally {
      client.release();
    }
  }

  async modificarDetalleProducto(detalle: DetalleProducto): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [detalle.id, detalle.cantEnInventario, detalle.idProducto];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.MODIFICAR_DETALLE_PRODUCTO($1, $2, $3)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al modificar el Detalle Producto: ' + err);
      throw new Error('Error al modificar el Detalle Producto.');
    } finally {
      client.release();
    }
  }

  async consultarMovimientosPorProducto(idProducto: number): Promise<MovimientoProducto[]> {
    const client = await PoolDb.connect();

    const params = [idProducto];

    try {
      const res = await client.query<DetalleProducto[]>('SELECT * FROM public.BUSCAR_MOVIMIENTOS_PRODUCTO($1)', params);

      const movimientos: MovimientoProducto[] = res.rows.map((row: any) => {
        const movimiento: MovimientoProducto = plainToClass(MovimientoProducto, row, { excludeExtraneousValues: true });
        const producto: Producto = plainToClass(Producto, row, { excludeExtraneousValues: true });

        movimiento.producto = producto;

        return movimiento;
      });

      return movimientos;
    } catch (err) {
      logger.error('Error al consultar Movimientos del Producto: ' + err);
      throw new Error('Error al consultar Movimientos del Producto.');
    } finally {
      client.release();
    }
  }
}
