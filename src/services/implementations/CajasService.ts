import { inject, injectable } from 'inversify';
import { TYPES } from '../types/types';
import { logger } from '../../logger/CustomLogger';
import { SpResult } from '../../models';
import { Caja } from '../../models/Caja';
import { FiltrosCajas } from '../../models/comandos/FiltroCaja';
import { ICajasService } from '../interfaces/ICajasService';
import { ICajasRepository } from '../../repositories/CajasRepository';
import { Arqueo } from '../../models/Arqueo';
import { FiltrosArqueos } from '../../models/comandos/FiltroArqueo';
import { EstadoArqueo } from '../../models/EstadoArqueo';
import { MovimientoManual } from '../../models/MovimientoManual';

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

  public async registrarArqueo(arqueo: Arqueo): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._cajasRepository.registrarArqueo(arqueo);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async consultarArqueos(filtro: FiltrosArqueos): Promise<Arqueo[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._cajasRepository.obtenerArqueos(filtro);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async eliminarArqueo(idArqueo: number): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._cajasRepository.eliminarArqueo(idArqueo);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async modificarArqueo(arqueo: Arqueo): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._cajasRepository.modificarArqueo(arqueo);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async obtenerEstadosArqueo(): Promise<EstadoArqueo[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._cajasRepository.obtenerEstadosArqueo();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async registrarMovimientoManual(movimiento: MovimientoManual): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._cajasRepository.registrarMovimientoManual(movimiento);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async consultarMovimientosManuales(idArqueo: number): Promise<MovimientoManual[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._cajasRepository.obtenerMovimientosManuales(idArqueo);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async eliminarMovimientoManual(idMovimiento: number): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._cajasRepository.eliminarMovimientoManual(idMovimiento);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }
}
