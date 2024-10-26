import { inject, injectable } from 'inversify';
import { TYPES } from '../types/types';
import { logger } from '../../logger/CustomLogger';
import { SpResult } from '../../models';
import { Caja } from '../../models/Caja';
import { FiltrosCajas } from '../../models/comandos/FiltroCaja';
import { ICajasService } from '../interfaces/ICajasService';
import { ICajasRepository } from '../../repositories/CajasRepository';

/**
 * Servicio que tiene como responsabilidad
 * lo vinculado a los cajas
 */
@injectable()
export class CajasService implements ICajasService {
  private readonly _cajasRepository: ICajasRepository;

  constructor(
    @inject(TYPES.CajasRepository)
    repository: ICajasRepository
  ) {
    this._cajasRepository = repository;
  }

  public async registrarCaja(caja: Caja): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._cajasRepository.registrarCaja(caja);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async consultarCajas(filtro: FiltrosCajas): Promise<Caja[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._cajasRepository.obtenerCajas(filtro);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async eliminarCaja(idCaja: number): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._cajasRepository.eliminarCaja(idCaja);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async modificarCaja(caja: Caja): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._cajasRepository.modificarCaja(caja);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }
}
