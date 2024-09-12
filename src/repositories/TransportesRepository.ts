import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import { SpResult } from '../models';
import PoolDb from '../data/db';
import { plainToClass } from 'class-transformer';
import { Transporte } from '../models/Transporte';

/**
 * Interfaz del repositorio de Proveedores
 */
export interface ITransportesRepository {
  obtenerTransportes(): Promise<Transporte[]>;
}

/**
 * Repositorio de alta, modificacion y consultas de proveedores
 */
@injectable()
export class TransportesRepository implements ITransportesRepository {
  /**
   * Método asíncrono para obtener los transportes
   * @returns {Transporte[]} - devuelve un array de Transportes
   */
  async obtenerTransportes(): Promise<Transporte[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<Transporte[]>('SELECT * FROM PUBLIC.TRANSPORTE t WHERE t.activo = 1');
      const result: Transporte[] = plainToClass(Transporte, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al consultar Transportes: ' + err);
      throw new Error('Error al consultar Transportes.');
    } finally {
      client.release();
    }
  }
}
