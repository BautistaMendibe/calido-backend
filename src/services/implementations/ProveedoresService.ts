import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { logger } from '../../logger/CustomLogger';
import { TYPES } from '../types/types';
import { IProveedoresService } from '../interfaces/IProveedoresService';
import { IProveedoresRepository } from '../../repositories/ProveedoresRepository';
import { Proveedor } from '../../models/Proveedor';
import { SpResult } from '../../models';
import { FiltrosProveedores } from '../../models/comandos/FiltroProveedores';
import { consultarProveedores, modificarProveedor } from '../../controllers/ProveedoresController';
import { TipoProveedor } from '../../models/TipoProveedor';
import { IDomicilioRepository } from '../../repositories/DomicilioRepository';

/**
 * Servicio que tiene como responsabilidad
 * lo vinculado a los proveedores
 */
@injectable()
export class ProveedoresService implements IProveedoresService {
  private readonly _proveedoresRepository: IProveedoresRepository;
  private readonly _domicilioRepository: IDomicilioRepository;

  constructor(
    @inject(TYPES.ProveedoresRepository)
    repository: IProveedoresRepository,
    @inject(TYPES.DomicilioRepository)
    domicilioRepository: IDomicilioRepository
  ) {
    this._proveedoresRepository = repository;
    this._domicilioRepository = domicilioRepository;
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

        // Mapea sobre los proveedores para buscar su tipo correspondiente
        const proveedores = await Promise.all(
          result.map(async (proveedor) => {
            const tipoProveedor: TipoProveedor = await this.buscarTipoProveedor(proveedor.idTipoProveedor);
            return { ...proveedor, tipoProveedor };
          })
        );

        resolve(proveedores);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async modificarProveedor(proveedor: Proveedor): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._proveedoresRepository.modificarProveedor(proveedor);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async eliminarProveedor(idProveedor: number): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._proveedoresRepository.eliminarProveedor(idProveedor);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async buscarTiposProveedores(): Promise<TipoProveedor[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._proveedoresRepository.buscarTiposProveedores();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async buscarTipoProveedor(id: number): Promise<TipoProveedor> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._proveedoresRepository.buscarTipoProveedor(id);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }
}
