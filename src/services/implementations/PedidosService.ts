import { inject, injectable } from 'inversify';
import { TYPES } from '../types/types';
import { logger } from '../../logger/CustomLogger';
import { IPedidosService } from '../interfaces/IPedidosService';
import { IPedidosRepository } from '../../repositories/PedidosRepository';
import { SpResult } from '../../models';
import { Pedido } from '../../models/Pedido';
import { FiltroPedidos } from '../../models/comandos/FiltroPedidos';
import { EstadoPedido } from '../../models/EstadoPedido';
import { OrdenDeCompraComando } from '../../models/comandos/OrdenesDeCompra.comando';

/**
 * Servicio que tiene como responsabilidad
 * lo vinculado a los pedidos (orden de compra)
 */
@injectable()
export class PedidosService implements IPedidosService {
  private readonly _pedidosRepository: IPedidosRepository;

  constructor(
    @inject(TYPES.PedidosRepository)
    repository: IPedidosRepository
  ) {
    this._pedidosRepository = repository;
  }

  public async registrarPedido(pedido: Pedido): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._pedidosRepository.registarPedido(pedido);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async consultarPedidos(filtro: FiltroPedidos): Promise<Pedido[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._pedidosRepository.consultarPedidos(filtro);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async eliminarPedido(idPedido: number): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._pedidosRepository.eliminarPedido(idPedido);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async obtenerEstadosPedido(): Promise<EstadoPedido[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._pedidosRepository.obtenerEstadosPedido();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async modificarPedido(pedido: Pedido): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._pedidosRepository.modificarPedido(pedido);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }
  public async buscarOrdenesDeCompraHome(): Promise<OrdenDeCompraComando[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._pedidosRepository.buscarOrdenesDeCompraHome();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

}
