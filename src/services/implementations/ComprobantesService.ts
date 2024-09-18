import { inject, injectable } from 'inversify';
import { TYPES } from '../types/types';
import { logger } from '../../logger/CustomLogger';
import { SpResult } from '../../models';
import { IComprobantesService } from '../interfaces/IComprobantesService';
import { IComprobantesRepository } from '../../repositories/ComprobantesRepository';
import { Comprobante } from '../../models/Comprobante';
import { FiltrosComprobantes } from '../../models/comandos/FiltroComprobantes';
import { TipoComprobante } from '../../models/TipoComprobante';

/**
 * Servicio que tiene como responsabilidad
 * lo vinculado a los comprobantes (remitos, facturas, etc) para stock
 */
@injectable()
export class ComprobantesService implements IComprobantesService {
  private readonly _comprobantesRepository: IComprobantesRepository;

  constructor(
    @inject(TYPES.ComprobantesRepository)
    repository: IComprobantesRepository
  ) {
    this._comprobantesRepository = repository;
  }

  public async registrarComprobante(comprobante: Comprobante): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._comprobantesRepository.registarComprobante(comprobante);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async consultarComprobantes(filtro: FiltrosComprobantes): Promise<Comprobante[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._comprobantesRepository.consultarComprobantes(filtro);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async eliminarComprobante(idComprobante: number): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._comprobantesRepository.eliminarComprobante(idComprobante);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async obtenerTiposComprobantes(): Promise<TipoComprobante[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._comprobantesRepository.obtenerTiposComprobantes();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async modificarComprobante(comprobante: Comprobante): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._comprobantesRepository.modificarComprobante(comprobante);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }
}
