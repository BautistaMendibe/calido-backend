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
  async obtenerDataReporte(reporte: ReporteComando): Promise<DataReporteComando[]> {
    const client = await PoolDb.connect();
    const params = [reporte.filtros.fechaDesde, reporte.filtros.fechaHasta];

    try {
      const query = `SELECT * FROM PUBLIC.${reporte.funcionSP}($1, $2)`;

      const res = await client.query<DataReporteComando[]>(query, params);
      const result: DataReporteComando[] = plainToClass(DataReporteComando, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al buscar datos del reporte. ' + err);
      throw new Error('Error al buscar datos del reporte.');
    } finally {
      client.release();
    }
  }
}
