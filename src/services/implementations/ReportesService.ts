import { inject, injectable } from 'inversify';
import { IReportesService } from '../interfaces/IReportesService';
import { IReportesRepository } from '../../repositories/ReportesRepository';
import { TYPES } from '../types/types';
import { logger } from '../../logger/CustomLogger';
import { ReporteComando } from '../../models/comandos/Reporte';
import { DataReporteComando } from '../../models/comandos/DataReporte';

/**
 * Servicio que tiene como responsabilidad
 * lo vinculado a los reportes
 */
@injectable()
export class ReportesService implements IReportesService {
  private readonly _reportesRepository: IReportesRepository;

  constructor(
    @inject(TYPES.ReportesRepository)
    repository: IReportesRepository
  ) {
    this._reportesRepository = repository;
  }

  public async obtenerDataReporte(reporte: ReporteComando): Promise<DataReporteComando[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._reportesRepository.obtenerDataReporte(reporte);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }
}
