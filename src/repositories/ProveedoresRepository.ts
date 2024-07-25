import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import { SpResult } from '../models';
import PoolDb from '../data/db';
import { plainToClass } from 'class-transformer';
import { Proveedor } from '../models/Proveedor';
import { FiltrosProveedores } from '../models/comandos/FiltroProveedores';

/**
 * Interfaz del repositorio de Proveedores
 */
export interface IProveedoresRepository {
  registrarProveedor(proveedor: Proveedor): Promise<SpResult>;
  consultarProveedores(filtro: FiltrosProveedores): Promise<Proveedor[]>;
  modificarProveedor(proveedor: Proveedor): Promise<SpResult>;
  eliminarProveedor(idProveedor: number): Promise<SpResult>;
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

  /**
   * Método asíncrono para consultar proveedores

   * @returns {Proveedor []} arreglo de proveedores
   */
  async consultarProveedores(filtro: FiltrosProveedores): Promise<Proveedor[]> {
    const client = await PoolDb.connect();

    const nombre = filtro.nombre;
    const params = [nombre];
    try {
      const res = await client.query<Proveedor[]>('SELECT * FROM PUBLIC.BUSCAR_PROVEEDORES($1)', params);
      return plainToClass(Proveedor, res.rows, {
        excludeExtraneousValues: true
      });
    } catch (err) {
      logger.error('Error al consultar Proveedores: ' + err);
      throw new Error('Error al consultar Proveedores.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para modificar los datos de un proveedor
   * @param {Proveedor} proveedor
   * @returns {SpResult}
   */
  async modificarProveedor(proveedor: Proveedor): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [proveedor.id, proveedor.nombre, proveedor.telefono, proveedor.email, 1, proveedor.cuit];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.MODIFICAR_PROVEEDOR($1, $2, $3, $4, $5, $6)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al modificar el proveedor: ' + err);
      throw new Error('Error al modificar el proveedor.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para eliminar un proveedor
   * @param {id} number id de proveedor
   * @returns {SpResult}
   */
  async eliminarProveedor(idProveedor: number): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [idProveedor];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.ELIMINAR_PROVEEDOR($1)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al eliminar el proveedor: ' + err);
      throw new Error('Error al eliminar el proveedor.');
    } finally {
      client.release();
    }
  }
}
