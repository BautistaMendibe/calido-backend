import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { logger } from '../../logger/CustomLogger';
import { TYPES } from '../types/types';
import { IDomicilioService } from '../interfaces/IDomicilioService';
import { IDomicilioRepository } from '../../repositories/DomicilioRepository';
import { Provincia } from '../../models/Provincia';
import { Localidad } from '../../models/Localidad';

/**
 * Servicio que tiene como responsabilidad
 * lo vinculado al domicilio
 */
@injectable()
export class DomicilioService implements IDomicilioService {
  private readonly _domicilioRepository: IDomicilioRepository;

  constructor(@inject(TYPES.DomicilioRepository) repository: IDomicilioRepository) {
    this._domicilioRepository = repository;
  }

  public async obtenerProvincias(): Promise<Provincia[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._domicilioRepository.obtenerProvincias();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async obtenerLocalidadesPorProvincia(idProvincia: number): Promise<Localidad[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._domicilioRepository.obtenerLocalidadesPorProvincia(idProvincia);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }
}
