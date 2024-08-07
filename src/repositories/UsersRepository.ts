import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import { SpResult } from '../models';
import PoolDb from '../data/db';
import { plainToClass } from 'class-transformer';
import { Usuario } from '../models/Usuario';
import { FiltroEmpleados } from '../models/comandos/FiltroEmpleados';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';

const secretKey = 'secret';

/**
 * Configuración de argon2 para hashear contraseñas
 * Se toma la configuración recomendada y la utilizada por BitWarden
 * @type {Object} Se utiliza el tipo Argon2id.
 * @property {number} memoryCost El costo de memoria 65536 (2^16) KiB.
 * @property {number} timeCost El costo de tiempo a utilizar.
 * @property {number} parallelism El paralelismo a utilizar.
 * @property {number} hashLength La longitud del hash a generar.
 */
export const argonConfig = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 3,
  parallelism: 4,
  hashLength: 32
};

/**
 * Interfaz del repositorio de usuarios
 */
export interface IUsersRepository {
  validarInicioSesion(nombreUsuario: string, contrasena: string): Promise<string>;
  registrarUsuario(usuario: Usuario): Promise<SpResult>;
  consultarEmpleados(filtro: FiltroEmpleados): Promise<Usuario[]>;
  modificarEmpleado(usuario: Usuario): Promise<SpResult>;
  eliminarUsuario(idUsuario: number): Promise<SpResult>;
  registrarSuperusuario(usuario: Usuario): Promise<SpResult>;
}

/**
 * Repositorio de alta, modificacion y consultas de usuarios
 */
@injectable()
export class UsersRepository implements IUsersRepository {
  /**
   * Método asíncrono para validar el hash de una contraseña enviada para un usuario
   * @param {string} nombreUsuario - nombre de usuario
   * @param {string} contrasena - contrasena del usuario
   * @returns {string} - devuelve un string. Si es correcto devuelve el token, si no ERROR
   */
  async validarInicioSesion(nombreUsuario: string, contrasena: string): Promise<string> {
    const client = await PoolDb.connect();

    try {
      // Consultar la base de datos para obtener el hash del usuario enviado como parámetro
      const res = await client.query<{ contrasena: string }>('SELECT * FROM PUBLIC.OBTENER_HASH_CONTRASENA($1)', [nombreUsuario]);
      if (res.rows.length === 0) {
        return 'ERROR';
      }

      const hashContrasena: string = res.rows[0].contrasena;

      // Validar la contraseña hasheada con la que se encuentra en la base de datos
      const verificacionValida = await argon2.verify(hashContrasena, contrasena);

      if (verificacionValida) {
        // Obtener el ID, nombre y apellido del empleado para crear el payload del JWT
        const idResult = await client.query<{ idusuario: number; nombre: string; apellido: string }>('SELECT * FROM public.OBTENER_PAYLOAD_EMPLEADO($1)', [nombreUsuario]);

        // Verificar si se obtuvo un resultado de ID
        if (idResult.rows.length === 0) {
          return 'ERROR';
        }

        const payload = {
          idusuario: idResult.rows[0].idusuario,
          nombre: idResult.rows[0].nombre,
          apellido: idResult.rows[0].apellido
        };

        // Generar y devolver el token JWT con el ID del usuario
        return jwt.sign(payload, secretKey, { expiresIn: '6h' });
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
    const client = await PoolDb.connect();

    // Hashear la contraseña antes de enviarla a la base de datos
    const contrasenaHashed = await argon2.hash(usuario.contrasena, argonConfig);

    const params = [
      usuario.nombreUsuario,
      usuario.nombre,
      usuario.apellido,
      usuario.fechaNacimiento,
      usuario.codigoPostal,
      usuario.dni,
      usuario.cuil,
      contrasenaHashed, // envía la contraseña hasheada directamente.
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

    // Hashear la nueva contraseña antes de enviarla a la base de datos
    const contrasenaHashed = await argon2.hash(usuario.contrasena, argonConfig);

    const params = [
      usuario.nombreUsuario,
      usuario.nombre,
      usuario.apellido,
      usuario.fechaNacimiento,
      usuario.codigoPostal,
      usuario.dni,
      usuario.cuil,
      contrasenaHashed, // La nueva contraseña tendrá que hashearse de nuevo.
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

  /**
   * Método asíncrono para registrar un superusuario
   * Es una versión simplificada del método registrarUsuario dado a que
   * no se necesitan todos los datos para el superusuario.
   * @param usuario
   * @returns {SpResult}
   */
  async registrarSuperusuario(usuario: Usuario): Promise<SpResult> {
    const client = await PoolDb.connect();

    // Hashear la contraseña antes de enviarla a la base de datos
    const contrasenaHashed = await argon2.hash(usuario.contrasena, argonConfig);

    const params = [usuario.nombreUsuario, usuario.nombre, usuario.apellido, contrasenaHashed];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_SUPERUSUARIO($1, $2, $3, $4)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al registrar Supersuario: ' + err);
      throw new Error('Error al registrar Supersuario.');
    } finally {
      client.release();
    }
  }
}
