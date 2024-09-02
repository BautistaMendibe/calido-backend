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

/**
 * Interfaz del repositorio de Proveedores
 */
export interface IPedidosRepository {
  registarPedido(pedido: Pedido): Promise<SpResult>;
  consultarPedidos(filtro: FiltroPedidos): Promise<Pedido[]>;
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

    const nombrePedido = filtro.pedido;
    const proveedor = filtro.proveedor;
    const fechaEmision = filtro.fechaEmision;

    const params = [nombrePedido, proveedor, fechaEmision];

    try {
      const res = await client.query<Pedido[]>('SELECT * FROM public.buscar_pedidos($1, $2, $3)', params);

      const pedidos = res.rows.map((row: any) => {
        const proveedor: Proveedor = plainToClass(Proveedor, row, { excludeExtraneousValues: true });
        const transporte: Transporte = plainToClass(Transporte, row, { excludeExtraneousValues: true });
        const estadoPedido: EstadoPedido = plainToClass(EstadoPedido, row, { excludeExtraneousValues: true });
        const pedido: Pedido = plainToClass(Pedido, row, { excludeExtraneousValues: true });

        pedido.proveedor = proveedor;
        pedido.transporte = transporte;
        pedido.estadoPedido = estadoPedido;

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
}
