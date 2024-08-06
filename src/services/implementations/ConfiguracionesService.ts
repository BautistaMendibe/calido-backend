import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { logger } from '../../logger/CustomLogger';
import { TYPES } from '../types/types';
import { IConfiguracionesService } from '../interfaces/IConfiguracionesService';
import { Configuracion } from '../../models/Configuracion';
import { IConfiguracionesRepository } from '../../repositories/ConfiguracionesRepository';
import { SpResult } from '../../models';
import { obtenerSuperusuario } from '../../controllers/ConfiguracionesController';

/**
 * Servicio que tiene como responsabilidad
 * lo vinculado a la configuración
 */
@injectable()
export class ConfiguracionesService implements IConfiguracionesService {
  private readonly _configuracionesRepository: IConfiguracionesRepository;

  constructor(@inject(TYPES.ConfiguracionesRepository) repository: IConfiguracionesRepository) {
    this._configuracionesRepository = repository;
  }

  public async obtenerConfiguraciones(): Promise<Configuracion> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._configuracionesRepository.consultarConfiguraciones();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async modificarConfiguracion(configuracion: Configuracion): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._configuracionesRepository.modificarConfiguracion(configuracion);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async registrarConfiguracion(): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._configuracionesRepository.registrarConfiguracion();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async existeConfiguracion(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._configuracionesRepository.existeConfiguracion();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async obtenerSuperusuario(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._configuracionesRepository.obtenerSuperusuario();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }
}
