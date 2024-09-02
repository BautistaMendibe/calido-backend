import { inject, injectable } from 'inversify';
import { TYPES } from '../types/types';
import { logger } from '../../logger/CustomLogger';
import { IPedidosService } from '../interfaces/IPedidosService';
import { IPedidosRepository } from '../../repositories/PedidosRepository';
import { SpResult } from '../../models';
import { Pedido } from '../../models/Pedido';

/**
 * Servicio que tiene como responsabilidad
 * lo vinculado a los usuarios
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
}
