import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import PoolDb from '../data/db';
import { plainToClass } from 'class-transformer';
import { ReporteComando } from '../models/comandos/Reporte';
import { DataReporteComando } from '../models/comandos/DataReporte';
import { UltimosMovimientos } from '../models/comandos/UltimosMovimientos';

/**
 * Interfaz del repositorio de reportes
 */
export interface IReportesRepository {
  obtenerDataReporte(reporte: ReporteComando): Promise<DataReporteComando[]>;
}

/**
 * Repositorio encargado de manejar las reportes
 */
@injectable()
export class ReportesRepository implements IReportesRepository {
  async obtenerDataReportes(reporte: ReporteComando): Promise<DataReporteComando[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<DataReporteComando[]>('SELECT * FROM PUBLIC.buscar_ultimos_logs()');
      const result: DataReporteComando[] = plainToClass(DataReporteComando, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al buscar los ultimos logs. ' + err);
      throw new Error('Error al buscar los ultimos logs.');
    } finally {
      client.release();
    }
  }
}
