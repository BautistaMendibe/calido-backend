import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import { SpResult } from '../models';
import PoolDb from '../data/db';
import { plainToClass } from 'class-transformer';
import { Marca } from '../models/Marca';

/**
 * Interfaz del repositorio de usuarios
 */
export interface IMarcasRepository {
  obtenerMarcas(): Promise<Marca[]>;
}

/**
 * Repositorio encargado de manejar el domicilio
 */
@injectable()
export class MarcasRepository implements IMarcasRepository {
  /**
   * Método asíncrono para obtener las provincias listadas
   * @returns {Provincia[]} - devuelve un array de Provincias
   */
  async obtenerMarcas(): Promise<Marca[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<Marca[]>('SELECT * FROM PUBLIC.MARCA');
      const result: Marca[] = plainToClass(Marca, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al consultar Marcas: ' + err);
      throw new Error('Error al consultar Marcas.');
    } finally {
      client.release();
    }
  }
}
