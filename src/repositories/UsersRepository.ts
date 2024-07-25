import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import { SpResult } from '../models';
import PoolDb from '../data/db';
import { plainToClass } from 'class-transformer';
import { Usuario } from '../models/Usuario';
import { FiltroEmpleados } from '../models/comandos/FiltroEmpleados';

const jwt = require('jsonwebtoken');
const secretKey = 'secret';

/**
 * Interfaz del repositorio de usuarios
 */
export interface IUsersRepository {
  validarInicioSesion(nombreUsuario: string, contrasena: string): Promise<string>;
  registrarUsuario(usuario: Usuario): Promise<SpResult>;
  consultarEmpleados(filtro: FiltroEmpleados): Promise<Usuario[]>;
  modificarEmpleado(usuario: Usuario): Promise<SpResult>;
  eliminarUsuario(idUsuario: number): Promise<SpResult>;
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
   * @returns {string} - devuelve un string. Si es correcto devuelve el token si no ERROR
   */
  async validarInicioSesion(nombreUsuario: string, contrasena: string): Promise<string> {
    const client = await PoolDb.connect();
    const params = [nombreUsuario, contrasena];

    try {
      const res = await client.query<Usuario>('SELECT * FROM PUBLIC.VALIDAR_INICIO_SESION($1, $2)', params);
      const result: Usuario = plainToClass(Usuario, res.rows[0], {
        excludeExtraneousValues: true
      });

      // Si la BD nos devuelve un usuario, lo que hacemos es armar el token con la informacion del mismo
      if (result) {
        const token: string = jwt.sign({ result }, secretKey, { expiresIn: '6h' });
        return token;
      } else {
        return 'ERROR';
      }
    } catch (err) {
      logger.error('Error al validar el usuario: ' + err);
      throw new Error('Error al validar los datos del usuario.');
    } finally {
      client.release();
    }
  }

  async registrarUsuario(usuario: Usuario): Promise<SpResult> {
    console.log(usuario.idGenero);
    console.log(usuario.codigoPostal);
    const client = await PoolDb.connect();
    const params = [
      usuario.nombreUsuario,
      usuario.nombre,
      usuario.apellido,
      usuario.fechaNacimiento,
      usuario.codigoPostal,
      usuario.dni,
      usuario.cuil,
      usuario.contrasena,
      1, // fuerza tipo 1, empleado. // usuario.idTipoUsuario, la funcion pide number y estos tiran string, adaptar y hacerlo bien.
      usuario.idGenero,
      1 // usuario.idDomicilio
    ];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_USUARIO($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al registrar Usuario: ' + err);
      throw new Error('Error al registrar Usuario.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para consultar empleados
   * @param {FiltrosEmpleados} filtros de busqueda
   * @returns {Usuario []} arreglo de empleados
   */
  async consultarEmpleados(filtro: FiltroEmpleados): Promise<Usuario[]> {
    const client = await PoolDb.connect();

    const nombre = filtro.nombre;
    const params = [nombre];
    try {
      const res = await client.query<Usuario[]>('SELECT * FROM PUBLIC.BUSCAR_EMPLEADOS($1)', params);
      const result: Usuario[] = plainToClass(Usuario, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al consultar Empleados: ' + err);
      throw new Error('Error al consultar Empleados. ');
    } finally {
      client.release();
    }
  }

  async modificarEmpleado(usuario: Usuario): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [
      usuario.nombreUsuario,
      usuario.nombre,
      usuario.apellido,
      usuario.fechaNacimiento,
      usuario.codigoPostal,
      usuario.dni,
      usuario.cuil,
      usuario.contrasena,
      1, // siempre empleado
      usuario.idGenero,
      1
    ]; // usuario.idDomicilio
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.MODIFICAR_USUARIO($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al modificar el usuario: ' + err);
      throw new Error('Error al modificar el usuario.');
    } finally {
      client.release();
    }
  }

  async eliminarUsuario(idUsuario: number): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [idUsuario];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.ELIMINAR_USUARIO($1)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al eliminar el usuario: ' + err);
      throw new Error('Error al eliminar el usuario.');
    } finally {
      client.release();
    }
  }
}
