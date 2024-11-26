// @ts-ignore

import { id, injectable } from 'inversify';
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
import { ComprobanteResponse } from '../models/ComprobanteResponse';
import { FiltrosVentas } from '../models/comandos/FiltroVentas';
import { VentasMensuales } from '../models/comandos/VentasMensuales';
import { VentasDiariaComando } from '../models/comandos/VentasDiariaComando';

/**
 * Interfaz del repositorio de Ventas
 */
export interface IVentasRepository {
  registarVenta(venta: Venta, client: PoolClient): Promise<SpResult>;
  registarDetalleVenta(producto: Producto, idVenta: number, client: PoolClient): Promise<SpResult>;
  buscarUsuariosClientes(): Promise<Usuario[]>;
  buscarFormasDePago(): Promise<FormaDePago[]>;
  obtenerCondicionesIva(): Promise<CondicionIva[]>;
  obtenerTipoFacturacion(): Promise<TipoFactura[]>;
  guardarComprobanteAfip(comprobanteResponse: ComprobanteResponse, venta: Venta): Promise<SpResult>;
  modificarComprobanteAfip(comprobanteResponse: ComprobanteResponse, venta: Venta, client: PoolClient): Promise<SpResult>;
  buscarVentas(filtros: FiltrosVentas): Promise<Venta[]>;
  buscarProductosPorVenta(idVenta: number): Promise<Producto[]>;
  buscarVentasPorCC(idUsuario: number): Promise<Venta[]>;
  anularVenta(venta: Venta, client: PoolClient): Promise<SpResult>;
  actualizarStockPorAnulacion(producto: Producto, idVenta: number, client: PoolClient): Promise<SpResult>;
  buscarVentasConFechaHora(fechaHora: string): Promise<Venta[]>;
  buscarCantidadVentasMensuales(): Promise<VentasMensuales[]>;
  buscarVentasPorDiaYHora(): Promise<VentasDiariaComando[]>;
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
    const params = [
      venta.cliente ? venta.cliente.id : null,
      venta.formaDePago.id,
      venta.montoTotal,
      venta.idEmpleado,
      null,
      venta.tarjeta ? venta.tarjeta : null,
      venta.cantidadCuotas ? venta.cantidadCuotas : null,
      venta.interes ? venta.interes : null,
      venta.descuento ? venta.descuento : null,
      venta.facturacion.id ? venta.facturacion.id : null,
      venta.idCaja ? venta.idCaja : null
    ];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_VENTA($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', params);
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
  async obtenerTipoFacturacion(): Promise<TipoFactura[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.TIPOS_FACTURACION');
      const result: TipoFactura[] = plainToClass(TipoFactura, res.rows, {
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

  /**
   * Método asíncrono para guardar el comprobante generado y vincularlo a la venta
   * @param {idCategoria}
   * @returns {CondicionIva[]}
   */
  async modificarComprobanteAfip(comprobanteResponse: ComprobanteResponse, venta: Venta, client: PoolClient): Promise<SpResult> {
    const params = [
      venta.id,
      comprobanteResponse.comprobante_nro,
      comprobanteResponse.afip_qr,
      comprobanteResponse.cae,
      comprobanteResponse.comprobante_tipo,
      comprobanteResponse.comprobante_pdf_url,
      comprobanteResponse.comprobante_ticket_url,
      comprobanteResponse.vencimiento_pago,
      comprobanteResponse.afip_codigo_barras,
      comprobanteResponse.vencimiento_cae,
      comprobanteResponse.fechaComprobante
    ];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_COMPROBANTE_AFIP($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al guardar el comprobante de venta: ' + err);
      throw new Error('Error al guardar el comprobante de venta.');
    }
  }

  /**
   * Método asíncrono para modificar el comprobante generado y vincularlo a la venta
   * @param {idCategoria}
   * @returns {CondicionIva[]}
   */
  async guardarComprobanteAfip(comprobanteResponse: ComprobanteResponse, venta: Venta): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [
      venta.id,
      comprobanteResponse.comprobante_nro,
      comprobanteResponse.afip_qr,
      comprobanteResponse.cae,
      comprobanteResponse.comprobante_tipo,
      comprobanteResponse.comprobante_pdf_url,
      comprobanteResponse.comprobante_ticket_url,
      comprobanteResponse.vencimiento_pago,
      comprobanteResponse.afip_codigo_barras,
      comprobanteResponse.vencimiento_cae,
      comprobanteResponse.fechaComprobante
    ];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_COMPROBANTE_AFIP($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al guardar el comprobante de venta: ' + err);
      throw new Error('Error al guardar el comprobante de venta.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para consultar las ventas generadas.
   * @returns {Venta[]}
   */
  async buscarVentas(filtros: FiltrosVentas): Promise<Venta[]> {
    const client = await PoolDb.connect();
    const params = [
      filtros.numero ? filtros.numero : null,
      filtros.fechaDesde ? filtros.fechaDesde : null,
      filtros.fechaHasta ? filtros.fechaHasta : null,
      filtros.formaDePago ? filtros.formaDePago : null,
      filtros.tipoFacturacion ? filtros.tipoFacturacion : null
    ];
    try {
      const res = await client.query('SELECT * FROM PUBLIC.BUSCAR_VENTAS($1, $2, $3, $4, $5)', params);

      const ventas: Venta[] = res.rows.map((row) => {
        const venta: Venta = plainToClass(Venta, row, { excludeExtraneousValues: true });
        const formaDePago: FormaDePago = plainToClass(FormaDePago, row, { excludeExtraneousValues: true });
        const comprobante: ComprobanteResponse = plainToClass(ComprobanteResponse, row, { excludeExtraneousValues: true });
        const cliente: Usuario = plainToClass(Usuario, row, { excludeExtraneousValues: true });
        const facturacion: TipoFactura = plainToClass(TipoFactura, row, { excludeExtraneousValues: true });
        const condicionIva: CondicionIva = plainToClass(CondicionIva, row, { excludeExtraneousValues: true });

        venta.formaDePago = formaDePago;
        venta.comprobanteAfip = comprobante;
        venta.cliente = cliente;
        venta.facturacion = facturacion;
        venta.cliente.condicionIva = condicionIva;

        return venta;
      });

      return ventas;
    } catch (err) {
      logger.error('Error al buscar las ventas: ' + err);
      throw new Error('Error al buscar las ventas.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para consultar los productos vendidos en una determinada venta
   * @param {IdVenta}
   * @returns {Producto[]}
   */
  async buscarProductosPorVenta(idVenta: number): Promise<Producto[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<Producto[]>('SELECT * FROM PUBLIC.BUSCAR_PRODUCTOS_POR_VENTA($1)', [idVenta]);
      const result: Producto[] = plainToClass(Producto, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al buscar productos por venta: ' + err);
      throw new Error('Error al buscar productos por venta.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para consultar las ventas generadas.
   * @returns {Venta[]}
   */
  async buscarVentasPorCC(idUsuario: number): Promise<Venta[]> {
    const client = await PoolDb.connect();
    const params = [idUsuario];
    try {
      const res = await client.query('SELECT * FROM PUBLIC.BUSCAR_VENTAS_POR_CC($1)', params);

      const ventas: Venta[] = res.rows.map((row) => {
        const venta: Venta = plainToClass(Venta, row, { excludeExtraneousValues: true });
        const formaDePago: FormaDePago = plainToClass(FormaDePago, row, { excludeExtraneousValues: true });
        const comprobante: ComprobanteResponse = plainToClass(ComprobanteResponse, row, { excludeExtraneousValues: true });

        venta.formaDePago = formaDePago;
        venta.comprobanteAfip = comprobante;

        return venta;
      });

      return ventas;
    } catch (err) {
      logger.error('Error al buscar las ventas: ' + err);
      throw new Error('Error al buscar las ventas.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para setear el valor anulado de venta igual a 0
   * @param {Venta}
   * @returns {SpResult}
   */
  async anularVenta(venta: Venta, client: PoolClient): Promise<SpResult> {
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.ANULAR_VENTA($1)', [venta.id]);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al anular la venta: ' + err);
      throw new Error('Error al anular la venta.');
    }
  }

  /**
   * Método asíncrono para actualizar el stock de un producto dada una venta anulada
   * @param {idVenta}
   * @param {producto}
   * @returns {SpResult}
   */
  async actualizarStockPorAnulacion(producto: Producto, idVenta: number, client: PoolClient): Promise<SpResult> {
    const params = [producto.id, producto.cantidadSeleccionada, true, idVenta, 'Anulacion de venta'];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.actualizar_inventario_venta($1, $2, $3, $4, $5)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al actualizar el stock de un producto dada una venta anulada: ' + err);
      throw new Error('Error al actualizar el stock de un producto dada una venta anulada.');
    }
  }

  /**
   * Método asíncrono para consultar las ventas generadas en una fecha determinada a partir de una hora.
   * @returns {Venta[]}
   */
  async buscarVentasConFechaHora(fechaHora: string): Promise<Venta[]> {
    const client = await PoolDb.connect();
    const params = [new Date(fechaHora) || null];
    try {
      const res = await client.query('SELECT * FROM PUBLIC.BUSCAR_VENTAS_FECHAHORA($1)', params);

      const ventas: Venta[] = res.rows.map((row) => {
        const venta: Venta = plainToClass(Venta, row, { excludeExtraneousValues: true });
        const formaDePago: FormaDePago = plainToClass(FormaDePago, row, { excludeExtraneousValues: true });
        const comprobante: ComprobanteResponse = plainToClass(ComprobanteResponse, row, { excludeExtraneousValues: true });
        const cliente: Usuario = plainToClass(Usuario, row, { excludeExtraneousValues: true });
        const facturacion: TipoFactura = plainToClass(TipoFactura, row, { excludeExtraneousValues: true });

        venta.formaDePago = formaDePago;
        venta.comprobanteAfip = comprobante;
        venta.cliente = cliente;
        venta.facturacion = facturacion;

        return venta;
      });

      return ventas;
    } catch (err) {
      logger.error('Error al buscar las ventas en fecha y hora: ' + err);
      throw new Error('Error al buscar las ventas en fecha y hora.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para consultar las ventas mensuales
   * @returns {VentasMensuales[]}
   */
  async buscarCantidadVentasMensuales(): Promise<VentasMensuales[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<VentasMensuales[]>('SELECT * FROM PUBLIC.buscar_cantidad_ventas_mensuales()');
      const result: VentasMensuales[] = plainToClass(VentasMensuales, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al buscar ventas mensuales. ' + err);
      throw new Error('Error al buscar ventas mensuales.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para consultar las ventas diarias
   * @returns {VentasDiariaComando[]}
   */
  async buscarVentasPorDiaYHora(): Promise<VentasDiariaComando[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<VentasDiariaComando[]>('SELECT * FROM PUBLIC.buscar_cantidad_ventas_hoy_ayer()');
      const result: VentasDiariaComando[] = plainToClass(VentasDiariaComando, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al buscar ventas diarias. ' + err);
      throw new Error('Error al buscar ventas diarias.');
    } finally {
      client.release();
    }
  }
}
