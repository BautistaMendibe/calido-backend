import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import PoolDb from '../data/db';
import { plainToClass } from 'class-transformer';

/**
 * Interfaz del repositorio de reportes
 */
export interface IReportesRepository {}

/**
 * Repositorio encargado de manejar las reportes
 */
@injectable()
export class ReportesRepository implements IReportesRepository {}
