import { id, inject, injectable } from 'inversify';
import 'reflect-metadata';
import { logger } from '../../logger/CustomLogger';
import { TYPES } from '../types/types';
import { IVentasService } from '../interfaces/IVentasService';
import { IVentasRepository } from '../../repositories/VentasRepository';
import { Venta } from '../../models/Venta';
import { SpResult } from '../../models';
import { Producto } from '../../models/Producto';

/**
 * Servicio que tiene como responsabilidad
 * lo vinculado a la configuración
 */
@injectable()
export class VentasService implements IVentasService {
  private readonly _ventasRepository: IVentasRepository;

  constructor(@inject(TYPES.VentasRepository) repository: IVentasRepository) {
    this._ventasRepository = repository;
  }

  public async registrarVenta(venta: Venta): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._ventasRepository.registarVenta(venta);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async registrarDetalleVenta(producto: Producto, idVenta: number): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._ventasRepository.registarDetalleVenta(producto, idVenta);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }
}
