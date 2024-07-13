import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { logger } from '../../logger/CustomLogger';
import { TYPES } from '../types/types';
import { IPromocionesService } from '../interfaces/IPromocionesService';
import { IPromocionesRepository } from '../../repositories/PromocionesRepository';
import { Promocion } from '../../models/Promocion';
import { SpResult } from '../../models';
import { FiltrosPromociones } from '../../models/comandos/FiltroPromociones';

/**
 * Servicio que tiene como responsabilidad
 * lo vinculado a los promociones
 */
@injectable()
export class PromocionesService implements IPromocionesService {
  private readonly _promocionesRepository: IPromocionesRepository;

  constructor(
    @inject(TYPES.PromocionesRepository)
    repository: IPromocionesRepository
  ) {
    this._promocionesRepository = repository;
  }

  public async registrarPromocion(promocion: Promocion): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._promocionesRepository.registrarPromocion(promocion);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async consultarPromociones(filtro: FiltrosPromociones): Promise<Promocion[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._promocionesRepository.consultarPromociones(filtro);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async modificarPromocion(promocion: Promocion): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._promocionesRepository.modificarPromocion(promocion);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async eliminarPromocion(idPromocion: number): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._promocionesRepository.eliminarPromocion(idPromocion);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }
}
