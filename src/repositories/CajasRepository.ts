import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import PoolDb from '../data/db';
import { plainToClass } from 'class-transformer';
import { Caja } from '../models/Caja';
import { SpResult } from '../models';
import { FiltrosCajas } from '../models/comandos/FiltroCaja';

/**
 * Interfaz del repositorio de cajas
 */
export interface ICajasRepository {
  obtenerCajas(filtro: FiltrosCajas): Promise<Caja[]>;
  registrarCaja(caja: Caja): Promise<SpResult>;
  modificarCaja(caja: Caja): Promise<SpResult>;
  eliminarCaja(idCaja: number): Promise<SpResult>;
}

/**
 * Repositorio encargado de manejar las cajas (cajas y arqueos)
 */
@injectable()
export class CajasRepository implements ICajasRepository {
  async obtenerCajas(filtro: FiltrosCajas): Promise<Caja[]> {
    const client = await PoolDb.connect();

    const params = [filtro.nombre];
    try {
      const res = await client.query<Caja[]>('SELECT * FROM public.BUSCAR_CAJAS($1)', params);
      const result: Caja[] = plainToClass(Caja, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al consultar Cajas: ' + err);
      throw new Error('Error al consultar Cajas.');
    } finally {
      client.release();
    }
  }

  async registrarCaja(caja: Caja): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [caja.nombre, caja.descripcion];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_CAJA($1, $2)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al registrar Caja: ' + err);
      throw new Error('Error al registrar Caja.');
    } finally {
      client.release();
    }
  }

  async modificarCaja(caja: Caja): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [caja.id, caja.nombre, caja.descripcion];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.MODIFICAR_CAJA($1, $2, $3)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al modificar la caja: ' + err);
      throw new Error('Error al modificar la caja.');
    } finally {
      client.release();
    }
  }

  async eliminarCaja(idCaja: number): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [idCaja];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.ELIMINAR_CAJA($1)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al eliminar la caja: ' + err);
      throw new Error('Error al eliminar la caja.');
    } finally {
      client.release();
    }
  }
}
