import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import PoolDb from '../data/db';
import { plainToClass } from 'class-transformer';
import { SpResult } from '../models';
import { Venta } from '../models/Venta';
import { Producto } from '../models/Producto';
import { Usuario } from '../models/Usuario';
import { FormaDePago } from '../models/FormaDePago';
import { PoolClient } from 'pg';
import { CondicionIva } from '../models/CondicionIva';
import { TipoFactura } from '../models/TipoFactura';

/**
 * Interfaz del repositorio de Ventas
 */
export interface IVentasRepository {
  registarVenta(venta: Venta, client: PoolClient): Promise<SpResult>;
  registarDetalleVenta(producto: Producto, idVenta: number, client: PoolClient): Promise<SpResult>;
  buscarUsuariosClientes(): Promise<Usuario[]>;
  buscarFormasDePago(): Promise<FormaDePago[]>;
  obtenerCondicionesIva(): Promise<CondicionIva[]>;
  obtenerTipoFacturacion(): Promise<TipoFactura>;
}

/**
 * Repositorio de alta, modificacion y consultas de configuraciones
 */
@injectable()
export class VentasRepository implements IVentasRepository {
  /**
   * Método asíncrono para registrar una venta
   * @param {Venta}
   * @returns {SpResult}
   */
  async registarVenta(venta: Venta, client: PoolClient): Promise<SpResult> {
    //const params = [venta.usuario ? venta.usuario.id : null, venta.formaDePago, venta.montoTotal];
    const params = [1, venta.formaDePago, venta.montoTotal];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_VENTA($1, $2, $3)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al registrar la venta: ' + err);
      throw new Error('Error al registrar la venta.');
    }
  }

  /**
   * Método asíncrono para registrar el detalle de una venta
   * @param {Producto}
   * @param {idVenta}
   * @returns {SpResult}
   */
  async registarDetalleVenta(producto: Producto, idVenta: number, client: PoolClient): Promise<SpResult> {
    const params = [producto.cantidadSeleccionada, producto.cantidadSeleccionada * producto.costo, idVenta, producto.id];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_DETALLE_VENTA($1, $2, $3, $4)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al registrar el detalle de la venta: ' + err);
      throw new Error('Error al registrar el detalle de la venta.');
    }
  }

  /**
   * Método asíncrono para consultar los usuarios registrados como clientes
   * @returns {Usuario[]}
   */
  async buscarUsuariosClientes(): Promise<Usuario[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.USUARIO WHERE idtipousuario = 2 AND activo = 1');
      const result: Usuario[] = plainToClass(Usuario, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al buscar los usuarios clientes: ' + err);
      throw new Error('Error al buscar los usuarios clientes.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para consultar los medios de pago
   * @returns {FormaDePago[]}
   */
  async buscarFormasDePago(): Promise<FormaDePago[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.FORMA_DE_PAGO WHERE activo = 1');
      const result: FormaDePago[] = plainToClass(FormaDePago, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al buscar los medios de pago: ' + err);
      throw new Error('Error al buscar los medios de pago.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para consultar las condiciones iva existente
   * @returns {CondicionIva[]}
   */
  async obtenerCondicionesIva(): Promise<CondicionIva[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.CONDICION_IVA');
      const result: CondicionIva[] = plainToClass(CondicionIva, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al buscar las categorias: ' + err);
      throw new Error('Error al buscar las categorias.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para consultar los tipos de facturas existente segun la categoria del cliente
   * @param {idCategoria}
   * @returns {CondicionIva[]}
   */
  async obtenerTipoFacturacion(): Promise<TipoFactura> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.');
      const result: TipoFactura = plainToClass(TipoFactura, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al buscar los tipos de facturacion: ' + err);
      throw new Error('Error al buscar los tipos de facturacion.');
    } finally {
      client.release();
    }
  }
}
