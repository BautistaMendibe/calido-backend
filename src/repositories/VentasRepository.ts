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
import { ComprobanteResponse } from '../models/ComprobanteResponse';
import { FiltrosVentas } from '../models/comandos/FiltroVentas';
import { TipoProveedor } from '../models/TipoProveedor';
import { DetalleVenta } from '../models/DetalleVenta';
import { FiltroCuentasCorrientes } from '../models/comandos/FiltroCuentasCorrientes';

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
  buscarVentas(filtros: FiltrosVentas): Promise<Venta[]>;
  buscarProductosPorVenta(idVenta: number): Promise<Producto[]>;
  buscarVentasPorCC(filtro: FiltroCuentasCorrientes): Promise<Venta[]>;
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
    const params = [1, venta.formaDePago.id, venta.montoTotal];
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
      comprobanteResponse.vencimiento_cae
    ];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_COMPROBANTE_AFIP($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', params);
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

  async buscarVentasPorCC(filtro: FiltroCuentasCorrientes): Promise<Venta[]> {
    const client = await PoolDb.connect();
    if (!filtro.fechaDesde) {
      filtro.fechaDesde = null;
    }
    if (!filtro.fechaHasta) {
      filtro.fechaHasta = null;
    }

    const params = [filtro.idUsuario, filtro.fechaDesde, filtro.fechaHasta];

    try {
      const res = await client.query('SELECT * FROM PUBLIC.BUSCAR_VENTAS_POR_CC($1, $2, $3)', params);
      console.log('Resultado de la consulta:', res);
      console.log('Parametros de la consulta:', params);
      // Mapa para agrupar las ventas
      const ventasMap = new Map<number, Venta>();
      res.rows.forEach((row) => {
        const ventaId = row.idventa;
        // Si la venta no existe en el map, la creamos
        if (!ventasMap.has(ventaId)) {
          const venta: Venta = plainToClass(
            Venta,
            {
              id: row.idventa,
              fecha: row.fechaventa,
              montoTotal: row.monto_total,
              detalleVenta: [] // Inicializamos el array vacío
            },
            {
              excludeExtraneousValues: true
            }
          );

          ventasMap.set(ventaId, venta);
        }

        // Crear el objeto Producto
        const producto: Producto = plainToClass(
          Producto,
          {
            id: row.idproducto,
            nombre: row.nproducto
          },
          {
            excludeExtraneousValues: true
          }
        );

        // Crear el objeto DetalleVenta
        const detalleVenta: DetalleVenta = plainToClass(
          DetalleVenta,
          {
            id: row.iddetalle,
            cantidad: row.cantidad,
            subTotal: row.subtotalventa, // Usar el subtotal original
            producto: producto
          },
          { excludeExtraneousValues: true }
        );

        // Agregar el detalle de la venta a la venta correspondiente
        ventasMap.get(ventaId)?.detalleVenta.push(detalleVenta);
      });

      // Convertir el map a un array
      return Array.from(ventasMap.values());
    } catch (err) {
      logger.error('repository error: ' + err);
      throw new Error('repository error');
    }
  }
}
