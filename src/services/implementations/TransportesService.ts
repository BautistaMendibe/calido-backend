import { inject, injectable } from 'inversify';
import { ITransportesService } from '../interfaces/ITransportesService';
import { TYPES } from '../types/types';
import { ITransportesRepository } from '../../repositories/TransportesRepository';
import { logger } from '../../logger/CustomLogger';
import { Transporte } from '../../models/Transporte';

/**
 * Servicio que tiene como responsabilidad
 * lo vinculado a los usuarios
 */
@injectable()
export class TransportesService implements ITransportesService {
  private readonly _transportesRepository: ITransportesRepository;

  constructor(
    @inject(TYPES.TransportesRepository)
    repository: ITransportesRepository
  ) {
    this._transportesRepository = repository;
  }

  public async obtenerTransportes(): Promise<Transporte[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._transportesRepository.obtenerTransportes();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }
}
