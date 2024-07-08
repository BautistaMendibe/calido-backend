import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { logger } from '../../logger/CustomLogger';
import { TYPES } from '../types/types';
import { IProveedoresService } from '../interfaces/IProveedoresService';
import { IProveedoresRepository } from '../../repositories/ProveedoresRepository';
import { Proveedor } from '../../models/Proveedor';
import { SpResult } from '../../models';
import { FiltrosProveedores } from '../../models/comandos/FiltroProveedores';
import { consultarProveedores } from '../../controllers/ProveedoresController';

/**
 * Servicio que tiene como responsabilidad
 * lo vinculado a los proveedores
 */
@injectable()
export class ProveedoresService implements IProveedoresService {
  private readonly _proveedoresRepository: IProveedoresRepository;

  constructor(
    @inject(TYPES.ProveedoresRepository)
    repository: IProveedoresRepository
  ) {
    this._proveedoresRepository = repository;
  }

  public async registrarProveedor(proveedor: Proveedor): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._proveedoresRepository.registrarProveedor(proveedor);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async consultarProveedores(filtro: FiltrosProveedores): Promise<Proveedor[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._proveedoresRepository.consultarProveedores(filtro);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }
}
