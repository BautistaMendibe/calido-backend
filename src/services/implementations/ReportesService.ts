import { inject, injectable } from 'inversify';
import { IReportesService } from '../interfaces/IReportesService';
import { IReportesRepository } from '../../repositories/ReportesRepository';
import { TYPES } from '../types/types';

/**
 * Servicio que tiene como responsabilidad
 * lo vinculado a los reportes
 */
@injectable()
export class ReportesService implements IReportesService {
  private readonly _reportesRepository: IReportesRepository;

  constructor(
    @inject(TYPES.CajasRepository)
    repository: IReportesRepository
  ) {
    this._reportesRepository = repository;
  }
}
