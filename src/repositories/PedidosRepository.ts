import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import { SpResult } from '../models';
import PoolDb from '../data/db';
import { plainToClass } from 'class-transformer';
import { Transporte } from '../models/Transporte';
import { Proveedor } from '../models/Proveedor';
import { Pedido } from '../models/Pedido';
import { FiltroPedidos } from '../models/comandos/FiltroPedidos';
import { EstadoPedido } from '../models/EstadoPedido';
import { DetallePedido } from '../models/DetallePedido';
import { TipoProveedor } from '../models/TipoProveedor';
import { Provincia } from '../models/Provincia';
import { Localidad } from '../models/Localidad';
import { Domicilio } from '../models/Domicilio';

/**
 * Interfaz del repositorio de Proveedores
 */
export interface IPedidosRepository {
  registarPedido(pedido: Pedido): Promise<SpResult>;
  consultarPedidos(filtro: FiltroPedidos): Promise<Pedido[]>;
  eliminarPedido(idPedido: number): Promise<SpResult>;
  obtenerEstadosPedido(): Promise<EstadoPedido[]>;
  modificarPedido(pedido: Pedido): Promise<SpResult>;
}

/**
 * Repositorio de alta, modificacion y consultas de proveedores
 */
@injectable()
export class PedidosRepository implements IPedidosRepository {
  /**
   * Método asíncrono para registrar un pedido
   * @param {Pedido}
   * @returns {SpResult}
   */
  async registarPedido(pedido: Pedido): Promise<SpResult> {
    const client = await PoolDb.connect();

    const detallePedidoJsonb = JSON.stringify(pedido.detallePedido);

    const params = [
      pedido.montoEnvio,
      pedido.fechaPedido,
      pedido.fechaEntrega,
      pedido.idEstadoPedido,
      pedido.idTransporte,
      pedido.idProveedor,
      pedido.descuento,
      pedido.impuesto,
      pedido.observaciones,
      pedido.total,
      detallePedidoJsonb,
      pedido.transporte.nombre
    ];

    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_PEDIDO($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al registrar el pedido: ' + err);
      throw new Error('Error al registrar el pedido.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para consultar pedidos
   * @param {FiltroPedidos} filtros de busqueda
   * @returns {Pedido[]} arreglo de pedidos
   */
  async consultarPedidos(filtro: FiltroPedidos): Promise<Pedido[]> {
    const client = await PoolDb.connect();

    const nombrePedido = filtro.pedido || null;
    const proveedor = filtro.proveedor || null;
    const fechaEmision = filtro.fechaEmision || null;

    const params = [nombrePedido, proveedor, fechaEmision];

    try {
      const res = await client.query<Pedido[]>('SELECT * FROM public.buscar_pedidos($1, $2, $3)', params);

      const pedidos = res.rows.map((row: any) => {
        // Mapeamos el proveedor y sus relaciones
        const proveedor: Proveedor = plainToClass(Proveedor, row, { excludeExtraneousValues: true });
        const tipoProveedor: TipoProveedor = plainToClass(TipoProveedor, row, { excludeExtraneousValues: true });
        const provincia: Provincia = plainToClass(Provincia, row, { excludeExtraneousValues: true });
        const localidad: Localidad = plainToClass(Localidad, row, { excludeExtraneousValues: true });
        const domicilio: Domicilio = plainToClass(Domicilio, row, { excludeExtraneousValues: true });

        // Establecemos las relaciones
        domicilio.localidad = localidad;
        localidad.provincia = provincia;
        proveedor.tipoProveedor = tipoProveedor;
        proveedor.domicilio = domicilio;

        // Mapeamos el transporte y el estado del pedido
        const transporte: Transporte = plainToClass(Transporte, row, { excludeExtraneousValues: true });
        const estadoPedido: EstadoPedido = plainToClass(EstadoPedido, row, { excludeExtraneousValues: true });

        // Mapeamos los detalles del pedido
        const detallePedido: DetallePedido[] = (row.detalles_pedido || []).map((detalle: any) => plainToClass(DetallePedido, detalle, { excludeExtraneousValues: true }));

        // Mapeamos el pedido
        const pedido: Pedido = plainToClass(Pedido, row, { excludeExtraneousValues: true });

        // Establecemos las relaciones del pedido
        pedido.proveedor = proveedor;
        pedido.transporte = transporte;
        pedido.estadoPedido = estadoPedido;
        pedido.detallePedido = detallePedido;

        return pedido;
      });

      return pedidos;
    } catch (err) {
      logger.error('Error al consultar Pedidos: ' + err);
      throw new Error('Error al consultar Pedidos.');
    } finally {
      client.release();
    }
  }

  async eliminarPedido(idPedido: number): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [idPedido];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.ELIMINAR_PEDIDO($1)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al eliminar el pedido: ' + err);
      throw new Error('Error al eliminar el pedido.');
    } finally {
      client.release();
    }
  }

  async obtenerEstadosPedido(): Promise<EstadoPedido[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<EstadoPedido[]>('SELECT * FROM PUBLIC.ESTADO_PEDIDO e WHERE e.activo = 1');
      const result: EstadoPedido[] = plainToClass(EstadoPedido, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al consultar Estados Pedido: ' + err);
      throw new Error('Error al consultar Estados Pedido.');
    } finally {
      client.release();
    }
  }

  async modificarPedido(pedido: Pedido): Promise<SpResult> {
    const client = await PoolDb.connect();

    const detallePedidoJsonb = JSON.stringify(pedido.detallePedido);

    console.log(pedido);

    const params = [
      pedido.id,
      pedido.montoEnvio,
      pedido.fechaPedido,
      pedido.fechaEntrega,
      pedido.idEstadoPedido,
      pedido.idTransporte,
      pedido.idProveedor,
      pedido.descuento,
      pedido.impuesto,
      pedido.observaciones,
      pedido.total,
      detallePedidoJsonb,
      pedido.transporte.nombre
    ];

    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.MODIFICAR_PEDIDO($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al modificar el pedido: ' + err);
      throw new Error('Error al modificar el pedido.');
    } finally {
      client.release();
    }
  }
}
