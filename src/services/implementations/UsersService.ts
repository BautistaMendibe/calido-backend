import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { logger } from '../../logger/CustomLogger';
import { TYPES } from '../types/types';
import { IUsersService } from '../interfaces/IUserService';
import { IUsersRepository } from '../../repositories/UsersRepository';
import { SpResult } from '../../models';
import { Usuario } from '../../models/Usuario';

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
}
