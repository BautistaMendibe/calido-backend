import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import PoolDb from '../data/db';
import { plainToClass } from 'class-transformer';
import { Caja } from '../models/Caja';
import { SpResult } from '../models';
import { FiltrosCajas } from '../models/comandos/FiltroCaja';
import { FiltrosArqueos } from '../models/comandos/FiltroArqueo';
import { Arqueo } from '../models/Arqueo';
import { EstadoArqueo } from '../models/EstadoArqueo';

/**
 * Interfaz del repositorio de cajas
 */
export interface ICajasRepository {
  obtenerCajas(filtro: FiltrosCajas): Promise<Caja[]>;
  registrarCaja(caja: Caja): Promise<SpResult>;
  modificarCaja(caja: Caja): Promise<SpResult>;
  eliminarCaja(idCaja: number): Promise<SpResult>;
  obtenerArqueos(filtro: FiltrosArqueos): Promise<Arqueo[]>;
  registrarArqueo(arqueo: Arqueo): Promise<SpResult>;
  modificarArqueo(arqueo: Arqueo): Promise<SpResult>;
  eliminarArqueo(idArqueo: number): Promise<SpResult>;
  obtenerEstadosArqueo(): Promise<EstadoArqueo[]>;
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

  async obtenerArqueos(filtro: FiltrosArqueos): Promise<Arqueo[]> {
    const client = await PoolDb.connect();

    const params = [filtro.idArqueo || null, filtro.fechaApertura || null, filtro.estado || null];
    try {
      const res = await client.query<Arqueo[]>('SELECT * FROM public.BUSCAR_ARQUEOS($1, $2, $3)', params);
      const arqueos = res.rows.map((row: any) => {
        // Mapeo de objetos del arqueo (caja y estado)
        const caja: Caja = plainToClass(Caja, row, { excludeExtraneousValues: true });
        const estadoArqueo: EstadoArqueo = plainToClass(EstadoArqueo, row, { excludeExtraneousValues: true });
        const arqueo: Arqueo = plainToClass(Arqueo, row, { excludeExtraneousValues: true });

        arqueo.caja = caja;
        arqueo.estadoArqueo = estadoArqueo;

        return arqueo;
      });
      return arqueos;
    } catch (err) {
      logger.error('Error al consultar Arqueos: ' + err);
      throw new Error('Error al consultar Arqueos.');
    } finally {
      client.release();
    }
  }

  async registrarArqueo(arqueo: Arqueo): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [
      arqueo.fechaApertura,
      arqueo.horaApertura,
      arqueo.montoInicial,
      arqueo.horaCierre,
      arqueo.sistema,
      arqueo.usuario,
      arqueo.diferencia,
      arqueo.idEstadoArqueo,
      arqueo.idCaja
    ];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_ARQUEO($1, $2, $3, $4, $5, $6, $7, $8, $9)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al registrar Arqueo: ' + err);
      throw new Error('Error al registrar Arqueo.');
    } finally {
      client.release();
    }
  }

  async modificarArqueo(arqueo: Arqueo): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [arqueo.id, arqueo.fechaApertura, arqueo.horaApertura, arqueo.montoInicial, arqueo.idCaja];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.MODIFICAR_ARQUEO($1, $2, $3, $4, $5)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al modificar el arqueo: ' + err);
      throw new Error('Error al modificar el arqueo.');
    } finally {
      client.release();
    }
  }

  async eliminarArqueo(idArqueo: number): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [idArqueo];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.ELIMINAR_ARQUEO($1)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al eliminar el arqueo: ' + err);
      throw new Error('Error al eliminar el arqueo.');
    } finally {
      client.release();
    }
  }

  async obtenerEstadosArqueo(): Promise<EstadoArqueo[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<EstadoArqueo[]>('SELECT * FROM PUBLIC.ESTADO_ARQUEO e WHERE e.activo = 1');
      const result: EstadoArqueo[] = plainToClass(EstadoArqueo, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al consultar Estados Arqueo: ' + err);
      throw new Error('Error al consultar Estados Arqueo.');
    } finally {
      client.release();
    }
  }
}
