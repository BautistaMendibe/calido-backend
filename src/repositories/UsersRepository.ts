import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import { SpResult } from '../models';
import PoolDb from '../data/db';
import { plainToClass } from 'class-transformer';
import { Usuario } from '../models/Usuario';
import { FiltroEmpleados } from '../models/comandos/FiltroEmpleados';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { Provincia } from '../models/Provincia';
import { Localidad } from '../models/Localidad';
import { Domicilio } from '../models/Domicilio';
import { Asistencia } from '../models/Asistencia';
import { FiltroAsistencias } from '../models/comandos/FiltroAsistencias';

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
  consultarAsistencias(filtro: FiltroAsistencias): Promise<Asistencia[]>;
  registrarAsistencia(asistencia: Asistencia): Promise<SpResult>;
  modificarAsistencia(asistencia: Asistencia): Promise<SpResult>;
  eliminarAsistencia(idAsistencia: number): Promise<SpResult>;
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
      1, // fuerza tipo 1, empleado.
      usuario.idGenero,
      usuario.domicilio.localidad.id,
      usuario.domicilio.calle,
      usuario.domicilio.numero
    ];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_USUARIO($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', params);
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

  async registrarAsistencia(asistencia: Asistencia): Promise<SpResult> {
    const client = await PoolDb.connect();

    const fecha = new Date(asistencia.fecha).toISOString().split('T')[0];

    const params = [asistencia.idUsuario, fecha, asistencia.horaEntrada, asistencia.horaSalida, asistencia.comentario];

    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_ASISTENCIA($1, $2, $3, $4, $5)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al registrar Asistencia: ' + err);
      throw new Error('Error al registrar Asistencia.');
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
      const res = await client.query('SELECT * FROM PUBLIC.BUSCAR_EMPLEADOS($1)', params);

      const usuarios = res.rows.map((row) => {
        // Armamos los objetos necesarios para la clase Usuario
        const provincia: Provincia = plainToClass(Provincia, row, { excludeExtraneousValues: true });
        const localidad: Localidad = plainToClass(Localidad, row, { excludeExtraneousValues: true });
        const domicilio: Domicilio = plainToClass(Domicilio, row, { excludeExtraneousValues: true });
        const usuario: Usuario = plainToClass(Usuario, row, { excludeExtraneousValues: true });

        domicilio.localidad = localidad;
        localidad.provincia = provincia;
        usuario.domicilio = domicilio;

        return usuario;
      });

      return usuarios;
    } catch (err) {
      logger.error('Error al consultar empleados: ' + err);
      throw new Error('Error al consultar empleados.');
    } finally {
      client.release();
    }
  }

  async modificarEmpleado(usuario: Usuario): Promise<SpResult> {
    const client = await PoolDb.connect();

    // Asigna la contraseña a la variable, si es distinta a '********' la hashea, sino la deja en '********' para que no se modifique (por funcion en BD)
    let contrasenaHashed = usuario.contrasena;
    // Hashear la nueva contraseña antes de enviarla a la base de datos si es distinta a '********'
    if (usuario.contrasena != '********') {
      contrasenaHashed = await argon2.hash(usuario.contrasena, argonConfig);
    }

    const params = [
      usuario.id,
      usuario.nombreUsuario,
      usuario.nombre,
      usuario.apellido,
      usuario.fechaNacimiento,
      usuario.codigoPostal,
      usuario.dni,
      usuario.cuil,
      contrasenaHashed, // La nueva contraseña tendrá que hashearse de nuevo.
      1, // siempre empleado, forzado.
      usuario.idGenero,
      usuario.domicilio.localidad.id,
      usuario.domicilio.calle,
      usuario.domicilio.numero
    ];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.MODIFICAR_USUARIO($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al modificar el empleado: ' + err);
      throw new Error('Error al modificar el empleado.');
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

  /**
   * Método asíncrono para consultar asistencias
   * @returns {Asistencia []} arreglo de asistencias
   */
  async consultarAsistencias(filtro: FiltroAsistencias): Promise<Asistencia[]> {
    const client = await PoolDb.connect();
    const params = [filtro.idUsuario, filtro.fecha];

    try {
      const res = await client.query<Asistencia>('SELECT * FROM PUBLIC.BUSCAR_ASISTENCIAS($1, $2)', params);

      const asistencias = res.rows.map((row) => {
        // Armamos los objetos necesarios para la clase Usuario
        const usuario: Usuario = plainToClass(Usuario, row, { excludeExtraneousValues: true });
        const asistencia: Asistencia = plainToClass(Asistencia, row, { excludeExtraneousValues: true });
        asistencia.usuario = usuario;

        return asistencia;
      });

      return asistencias;
    } catch (err) {
      logger.error('Error al consultar asistencias: ' + err);
      throw new Error('Error al consultar asistencias.');
    } finally {
      client.release();
    }
  }

  async modificarAsistencia(asistencia: Asistencia): Promise<SpResult> {
    const client = await PoolDb.connect();

    const fecha = new Date(asistencia.fecha).toISOString().split('T')[0];

    const params = [asistencia.id, asistencia.idUsuario, fecha, asistencia.horaEntrada, asistencia.horaSalida, asistencia.comentario];

    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.MODIFICAR_ASISTENCIA($1, $2, $3, $4, $5, $6)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al modificar la asistencia: ' + err);
      throw new Error('Error al modificar la asistencia.');
    } finally {
      client.release();
    }
  }

  async eliminarAsistencia(idAsistencia: number): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [idAsistencia];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.ELIMINAR_ASISTENCIA($1)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al eliminar la asistencia: ' + err);
      throw new Error('Error al eliminar la asistencia.');
    } finally {
      client.release();
    }
  }
}
