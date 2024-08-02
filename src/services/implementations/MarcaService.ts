import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { logger } from '../../logger/CustomLogger';
import { TYPES } from '../types/types';
import { IMarcaService } from '../interfaces/IMarcaService';
import { IMarcasRepository } from '../../repositories/MarcasRepository';
import { Marca } from '../../models/Marca';

/**
 * Servicio que tiene como responsabilidad
 * lo vinculado al domicilio
 */
@injectable()
export class MarcaService implements IMarcaService {
  private readonly _marcaRepository: IMarcasRepository;

  constructor(@inject(TYPES.MarcasRepository) repository: IMarcasRepository) {
    this._marcaRepository = repository;
  }

  public async obtenerMarcas(): Promise<Marca[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._marcaRepository.obtenerMarcas();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }
}
