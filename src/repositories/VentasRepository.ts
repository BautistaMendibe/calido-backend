import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import PoolDb from '../data/db';
import { plainToClass } from 'class-transformer';
import { Configuracion } from '../models/Configuracion';
import { SpResult } from '../models';
import { Usuario } from '../models/Usuario';
import { Venta } from '../models/Venta';

/**
 * Interfaz del repositorio de Ventas
 */
export interface IVentasRepository {
  registarVenta(venta: Venta): Promise<SpResult>;
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
  async registarVenta(venta: Venta): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = ['hola'];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.MODIFICAR_CONFIGURACION($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al registrar la venta: ' + err);
      throw new Error('Error al registrar la venta.');
    } finally {
      client.release();
    }
  }
}
