import { inject, injectable } from 'inversify';
import { TYPES } from '../types/types';
import { logger } from '../../logger/CustomLogger';
import { SpResult } from '../../models';
import { ITarjetasRepository } from '../../repositories/TarjetasRepository';
import { Tarjeta } from '../../models/Tarjeta';
import { FiltrosTarjetas } from '../../models/comandos/FiltroTarjetas';
import { TipoTarjeta } from '../../models/TipoTarjeta';
import { ITarjetasService } from '../interfaces/ITarjetasService';
import { Cuota } from '../../models/Cuota';

/**
 * Servicio que tiene como responsabilidad
 * lo vinculado a los tarjetas (y sus cuotas)
 */
@injectable()
export class TarjetasService implements ITarjetasService {
  private readonly _tarjetasRepository: ITarjetasRepository;

  constructor(
    @inject(TYPES.TarjetasRepository)
    repository: ITarjetasRepository
  ) {
    this._tarjetasRepository = repository;
  }

  public async registrarTarjeta(tarjeta: Tarjeta): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._tarjetasRepository.registrarTarjeta(tarjeta);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async consultarTarjetas(filtro: FiltrosTarjetas): Promise<Tarjeta[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._tarjetasRepository.consultarTarjetas(filtro);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async eliminarTarjeta(idTarjeta: number): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._tarjetasRepository.eliminarTarjeta(idTarjeta);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async buscarTiposTarjetas(): Promise<TipoTarjeta[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._tarjetasRepository.buscarTiposTarjetas();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async consultarCuotas(): Promise<Cuota[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._tarjetasRepository.consultarCuotas();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async modificarTarjeta(tarjeta: Tarjeta): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._tarjetasRepository.modificarTarjeta(tarjeta);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }
}
