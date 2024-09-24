import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { logger } from '../../logger/CustomLogger';
import { TYPES } from '../types/types';
import { IUsersService } from '../interfaces';
import { IUsersRepository } from '../../repositories';
import { SpResult } from '../../models';
import { Usuario } from '../../models/Usuario';
import { FiltroEmpleados } from '../../models/comandos/FiltroEmpleados';
import { Asistencia } from '../../models/Asistencia';
import { FiltroAsistencias } from '../../models/comandos/FiltroAsistencias';
import { FiltroCuentasCorrientes } from '../../models/comandos/FiltroCuentasCorrientes';
import { CuentaCorriente } from '../../models/CuentaCorriente';
import { TipoProducto } from '../../models/TipoProducto';
import { Rol } from '../../models/Rol';

/**
 * Servicio que tiene como responsabilidad
 * lo vinculado a los usuarios
 */
@injectable()
export class UsersService implements IUsersService {
  private readonly _usersRepository: IUsersRepository;

  constructor(
    @inject(TYPES.UsersRepository)
    repository: IUsersRepository
  ) {
    this._usersRepository = repository;
  }

  public async registrarUsuario(usuario: Usuario): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.registrarUsuario(usuario);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }
  public async validarInicioSesion(nombreUsuario: string, contrasena: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.validarInicioSesion(nombreUsuario, contrasena);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async consultarEmpleados(filtro: FiltroEmpleados): Promise<Usuario[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.consultarEmpleados(filtro);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async modificarEmpleado(usuario: Usuario): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.modificarEmpleado(usuario);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async eliminarUsuario(idUsuario: number): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.eliminarUsuario(idUsuario);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async eliminarAsistencia(idAsistencia: number): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.eliminarAsistencia(idAsistencia);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async registrarSuperusuario(usuario: Usuario): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.registrarSuperusuario(usuario);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async consultarAsistencias(filtro: FiltroAsistencias): Promise<Asistencia[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.consultarAsistencias(filtro);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async registrarAsistencia(asistencia: Asistencia): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.registrarAsistencia(asistencia);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async modificarAsistencia(asistencia: Asistencia): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.modificarAsistencia(asistencia);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async obtenerRoles(): Promise<Rol[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.obtenerRoles();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async obtenerRolesUsuario(idUsuario: number): Promise<Rol[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.obtenerRolesUsuario(idUsuario);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async consultarCuentasCorrientesxUsuario(filtro: FiltroCuentasCorrientes): Promise<CuentaCorriente[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.consultarCuentasCorrientesxUsuario(filtro);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async consultarAllUsuarios(): Promise<Usuario[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.consultarAllUsuarios();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async registrarCuentaCorriente(cuentaCorriente: CuentaCorriente): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.registrarCuentaCorriente(cuentaCorriente);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async modificarCuentaCorriente(cuentaCorriente: CuentaCorriente): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.modificarCuentaCorriente(cuentaCorriente);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async eliminarCuentaCorriente(idCuentaCorriente: number): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.eliminarCuentaCorriente(idCuentaCorriente);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }
}
