import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import { SpResult } from '../models';
import PoolDb from '../data/db';
import { plainToClass } from 'class-transformer';
import { Proveedor } from '../models/Proveedor';

/**
 * Interfaz del repositorio de Proveedores
 */
export interface IProveedoresRepository {
  registrarProveedor(proveedor: Proveedor): Promise<SpResult>;
}

/**
 * Repositorio de alta, modificacion y consultas de proveedores
 */
@injectable()
export class ProveedoresRepository implements IProveedoresRepository {
  /**
   * Método asíncrono para registar un proveedor
   * @param {Proveedor} proveedor
   * @returns {SpResult}
   */
  async registrarProveedor(proveedor: Proveedor): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [proveedor.nombre, proveedor.telefono, proveedor.email, 1, proveedor.cuit];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_PROVEEDOR($1, $2, $3, $4, $5)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al registrar Proveedor: ' + err);
      throw new Error('Error al registrar Proveedor.');
    } finally {
      client.release();
    }
  }
}
