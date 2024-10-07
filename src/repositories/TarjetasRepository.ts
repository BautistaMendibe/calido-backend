import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import { SpResult } from '../models';
import PoolDb from '../data/db';
import { plainToClass } from 'class-transformer';
import { Tarjeta } from '../models/Tarjeta';
import { FiltrosTarjetas } from '../models/comandos/FiltroTarjetas';
import { TipoTarjeta } from '../models/TipoTarjeta';
import { CuotaPorTarjeta } from '../models/CuotaPorTarjeta';
import { Cuota } from '../models/Cuota';

/**
 * Interfaz del repositorio de Tarjetas
 */
export interface ITarjetasRepository {
  registrarTarjeta(tarjeta: Tarjeta): Promise<SpResult>;
  consultarTarjetas(filtro: FiltrosTarjetas): Promise<Tarjeta[]>;
  eliminarTarjeta(idTarjeta: number): Promise<SpResult>;
  buscarTiposTarjetas(): Promise<TipoTarjeta[]>;
  modificarTarjeta(tarjeta: Tarjeta): Promise<SpResult>;
  consultarCuotas(): Promise<Cuota[]>;
}

/**
 * Repositorio de alta, modificacion y consultas de tarjetas/cuotas
 */
@injectable()
export class TarjetasRepository implements ITarjetasRepository {
  /**
   * Método asíncrono para registrar una tarjeta
   * @returns {SpResult}
   * @param Tarjeta tarjeta
   */
  async registrarTarjeta(tarjeta: Tarjeta): Promise<SpResult> {
    const client = await PoolDb.connect();

    const cuotasPorTarjeta = JSON.stringify(tarjeta.cuotaPorTarjeta);

    const params = [tarjeta.nombre, tarjeta.idTipoTarjeta, cuotasPorTarjeta];

    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_TARJETA($1, $2, $3)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al registrar la tarjeta: ' + err);
      throw new Error('Error al registrar la tarjeta.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para consultar tarjetas
   * @returns {Tarjeta[]} arreglo de tarjetas
   * @param FiltroTarjetas filtro
   */
  async consultarTarjetas(filtro: FiltrosTarjetas): Promise<Tarjeta[]> {
    const client = await PoolDb.connect();

    const tarjeta = filtro.nombre || null;
    const tipoTarjeta = filtro.tipoTarjeta || null;

    const params = [tarjeta, tipoTarjeta];

    try {
      const res = await client.query<Tarjeta[]>('SELECT * FROM public.BUSCAR_TARJETAS($1, $2)', params);

      const tarjetas: Tarjeta[] = res.rows.map((row: any) => {
        // Mapeamos entidades
        const tipoTarjeta: TipoTarjeta = plainToClass(TipoTarjeta, row, { excludeExtraneousValues: true });
        const tarjeta: Tarjeta = plainToClass(Tarjeta, row, { excludeExtraneousValues: true });

        // Mapeamos las cuotas por tarjeta
        const cuotasPorTarjeta: CuotaPorTarjeta[] = (row.cuota_por_tarjeta || []).map((cuota: any) => plainToClass(CuotaPorTarjeta, cuota, { excludeExtraneousValues: true }));

        // Mapeamos la tarjeta
        tarjeta.tipoTarjeta = tipoTarjeta;
        tarjeta.cuotaPorTarjeta = cuotasPorTarjeta;

        return tarjeta;
      });

      return tarjetas;
    } catch (err) {
      logger.error('Error al consultar Tarjetas: ' + err);
      throw new Error('Error al consultar Tarjetas.');
    } finally {
      client.release();
    }
  }

  async eliminarTarjeta(idTarjeta: number): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [idTarjeta];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.ELIMINAR_TARJETA($1)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al eliminar la tarjeta: ' + err);
      throw new Error('Error al eliminar la tarjeta.');
    } finally {
      client.release();
    }
  }

  async buscarTiposTarjetas(): Promise<TipoTarjeta[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<TipoTarjeta[]>('SELECT * FROM PUBLIC.TIPO_TARJETA t WHERE t.activo = 1');
      const result: TipoTarjeta[] = plainToClass(TipoTarjeta, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al consultar Tipos Tarjetas: ' + err);
      throw new Error('Error al consultar Tipos Tarjetas.');
    } finally {
      client.release();
    }
  }

  async consultarCuotas(): Promise<Cuota[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<Cuota[]>('SELECT * FROM PUBLIC.CUOTA c WHERE c.activo = 1');
      const result: Cuota[] = plainToClass(Cuota, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al consultar Cuotas: ' + err);
      throw new Error('Error al consultar Cuotas.');
    } finally {
      client.release();
    }
  }

  async modificarTarjeta(tarjeta: Tarjeta): Promise<SpResult> {
    const client = await PoolDb.connect();

    const cuotasPorTarjeta = JSON.stringify(tarjeta.cuotaPorTarjeta);

    const params = [tarjeta.id, tarjeta.nombre, tarjeta.idTipoTarjeta, cuotasPorTarjeta];

    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.MODIFICAR_TARJETA($1, $2, $3, $4)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al modificar la tarjeta: ' + err);
      throw new Error('Error al modificar la tarjeta.');
    } finally {
      client.release();
    }
  }
}
