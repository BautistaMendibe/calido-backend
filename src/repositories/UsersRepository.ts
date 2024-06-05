import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import { SpResult } from '../models';
import PoolDb from '../data/db';

/**
 * Interfaz del repositorio de usuarios
 */
export interface IUsersRepository {
  validarInicioSesion(nombreUsuario: string, contrasena: string): Promise<SpResult>;
}

/**
 * Repositorio de alta, modificacion y consultas de usuarios
 */
@injectable()
export class UsersRepository implements IUsersRepository {
  /**
   * Método asíncrono para consultar si existe un usuario en la base
   * @param {string} nombreUsuario - nombre de usuario
   * @param {string} contrasena - contrasena del usuario
   * @returns {SpResult} - devuelve un SpResult
   */
  async validarInicioSesion(nombreUsuario: string, contrasena: string): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [nombreUsuario, contrasena];

    try {
      const res = await client.query<SpResult>('SELECT * FROM VALIDAR_INICIO_SESION($1, $2)', params);
      const result: SpResult = res.rows[0];
      return result;
    } catch (err) {
      logger.error('Error al validar el usuario: ' + err);
      throw new Error('Error al validar los datos del usuario.');
    } finally {
      client.release();
    }
  }
}
