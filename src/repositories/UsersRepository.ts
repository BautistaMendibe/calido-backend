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
import { FiltroCuentasCorrientes } from '../models/comandos/FiltroCuentasCorrientes';
import { CuentaCorriente } from '../models/CuentaCorriente';
import { Rol } from '../models/Rol';
import { CondicionIva } from '../models/CondicionIva';
import { Motivo } from '../models/Motivo';
import { Licencia } from '../models/Licencia';
import { FiltrosLicencias } from '../models/comandos/FiltroLicencias';
import { EstadoLicencia } from '../models/EstadoLicencia';
import { Archivo } from '../models/Archivo';
import { RecuperarContrasena } from '../models/RecuperarContrasena';
import { UltimosMovimientos } from '../models/comandos/UltimosMovimientos';
import { VentasMensuales } from '../models/comandos/VentasMensuales';

const secretKey = process.env.JWT_SECRET;

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
  consultarClientes(filtro: FiltroEmpleados): Promise<Usuario[]>;
  modificarEmpleado(usuario: Usuario): Promise<SpResult>;
  eliminarUsuario(idUsuario: number): Promise<SpResult>;
  registrarSuperusuario(usuario: Usuario): Promise<SpResult>;
  consultarAsistencias(filtro: FiltroAsistencias): Promise<Asistencia[]>;
  registrarAsistencia(asistencia: Asistencia): Promise<SpResult>;
  modificarAsistencia(asistencia: Asistencia): Promise<SpResult>;
  eliminarAsistencia(idAsistencia: number): Promise<SpResult>;
  obtenerRolesUsuario(idUsuario: number): Promise<Rol[]>;
  obtenerRoles(): Promise<Rol[]>;
  consultarCuentasCorrientesxUsuario(filtro: FiltroCuentasCorrientes): Promise<CuentaCorriente[]>;
  registrarCuentaCorriente(cuentaCorriente: CuentaCorriente): Promise<SpResult>;
  modificarCuentaCorriente(cuentaCorriente: CuentaCorriente): Promise<SpResult>;
  consultarAllUsuarios(): Promise<Usuario[]>;
  eliminarCuentaCorriente(idCuentaCorriente: number): Promise<SpResult>;
  obtenerMotivosLicencia(): Promise<Motivo[]>;
  registrarLicencia(licencia: Licencia): Promise<SpResult>;
  eliminarLicencia(idLicencia: number): Promise<SpResult>;
  consultarLicencias(filtro: FiltrosLicencias): Promise<Licencia[]>;
  obtenerEstadosLicencia(): Promise<EstadoLicencia[]>;
  modificarLicencia(licencia: Licencia): Promise<SpResult>;
  buscarUltimosClientes(): Promise<Usuario[]>;
  buscarUltimosLogs(): Promise<UltimosMovimientos[]>;
  recuperarContrasena(recuperarContrasena: RecuperarContrasena): Promise<SpResult>;
  cambiarContrasena(recuperarContrasena: RecuperarContrasena): Promise<SpResult>;
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
      const res = await client.query<{ contrasena: string }>('SELECT * FROM PUBLIC.OBTENER_HASH_CONTRASENA($1)', [nombreUsuario]);
      if (res.rows.length === 0) {
        return 'ERROR';
      }

      const hashContrasena: string = res.rows[0].contrasena;
      const verificacionValida = await argon2.verify(hashContrasena, contrasena);

      if (verificacionValida) {
        const idResult = await client.query<{ idusuario: number; nombre: string; apellido: string; roles: string[] }>('SELECT * FROM public.OBTENER_PAYLOAD_EMPLEADO($1)', [
          nombreUsuario
        ]);

        if (idResult.rows.length === 0) {
          return 'ERROR';
        }

        const payload = {
          idusuario: idResult.rows[0].idusuario,
          nombre: idResult.rows[0].nombre,
          apellido: idResult.rows[0].apellido,
          roles: idResult.rows[0].roles
        };

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
    let contrasenaHashed = null;

    if (usuario.tipoUsuario.id == 1) {
      // Hashear la contraseña antes de enviarla a la base de datos
      contrasenaHashed = await argon2.hash(usuario.contrasena, argonConfig);
    }

    const params = [
      usuario.nombreUsuario ? usuario.nombreUsuario : null,
      usuario.nombre ? usuario.nombre : null,
      usuario.apellido ? usuario.apellido : null,
      usuario.fechaNacimiento ? usuario.fechaNacimiento : null,
      usuario.codigoPostal ? usuario.codigoPostal : null,
      usuario.dni ? usuario.dni : null,
      usuario.cuil ? usuario.cuil : null,
      usuario.cuit ? usuario.cuit : null,
      contrasenaHashed,
      usuario.tipoUsuario.id ? usuario.tipoUsuario.id : null,
      usuario.idGenero ? usuario.idGenero : null,
      usuario.domicilio.localidad.id ? usuario.domicilio.localidad.id : null,
      usuario.domicilio.calle ? usuario.domicilio.calle : null,
      usuario.domicilio.numero ? usuario.domicilio.numero : null,
      usuario.roles ? usuario.roles : null,
      usuario.mail ? usuario.mail : null,
      usuario.idCondicionIva ? usuario.idCondicionIva : null
    ];

    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_USUARIO($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)', params);
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

        // Mapeamos los roles
        const roles: Rol[] = row.idroles.map((idrol: number, index: number) => {
          return plainToClass(Rol, {
            idrol: idrol,
            nrol: row.nroles[index]
          });
        });

        usuario.roles = roles;

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

  /**
   * Método asíncrono para consultar clientes
   * @param {FiltrosEmpleados} filtros de busqueda
   * @returns {Usuario []} arreglo de usuarios
   */
  async consultarClientes(filtro: FiltroEmpleados): Promise<Usuario[]> {
    const client = await PoolDb.connect();
    const id = filtro.id;
    const nombre = filtro.nombre;
    const apellido = filtro.apellido;
    const mail = filtro.mail;
    const params = [id, nombre, apellido, mail];
    try {
      const res = await client.query('SELECT * FROM PUBLIC.BUSCAR_CLIENTES($1, $2, $3, $4)', params);

      const usuarios = res.rows.map((row) => {
        // Armamos los objetos necesarios para la clase Usuario
        const provincia: Provincia = plainToClass(Provincia, row, { excludeExtraneousValues: true });
        const localidad: Localidad = plainToClass(Localidad, row, { excludeExtraneousValues: true });
        const domicilio: Domicilio = plainToClass(Domicilio, row, { excludeExtraneousValues: true });
        const condicionIva: CondicionIva = plainToClass(CondicionIva, row, { excludeExtraneousValues: true });
        const usuario: Usuario = plainToClass(Usuario, row, { excludeExtraneousValues: true });

        domicilio.localidad = localidad;
        localidad.provincia = provincia;
        usuario.domicilio = domicilio;
        usuario.condicionIva = condicionIva;

        return usuario;
      });

      return usuarios;
    } catch (err) {
      logger.error('Error al consultar clientes: ' + err);
      throw new Error('Error al consultar clientes.');
    } finally {
      client.release();
    }
  }

  async modificarEmpleado(usuario: Usuario): Promise<SpResult> {
    const client = await PoolDb.connect();

    // Asigna la contraseña a la variable, si es distinta a '********' la hashea, sino la deja en '********' para que no se modifique (por funcion en BD)
    let contrasenaHashed = usuario.contrasena;
    // Hashear la nueva contraseña antes de enviarla a la base de datos si es distinta a '********'
    if (usuario.contrasena && usuario.idTipoUsuario === 1 && usuario.contrasena != '********') {
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
      usuario.cuit,
      contrasenaHashed,
      usuario.idTipoUsuario,
      usuario.idGenero,
      usuario.domicilio.localidad.id,
      usuario.domicilio.calle || null,
      usuario.domicilio.numero || null,
      usuario.roles,
      usuario.idCondicionIva,
      usuario.mail
    ];

    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.MODIFICAR_USUARIO($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)', params);
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

    const params = [usuario.nombreUsuario, usuario.nombre, usuario.apellido, contrasenaHashed, usuario.mail];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_SUPERUSUARIO($1, $2, $3, $4, $5)', params);
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

  async consultarCuentasCorrientesxUsuario(filtro: FiltroCuentasCorrientes): Promise<CuentaCorriente[]> {
    const client = await PoolDb.connect();

    filtro.cliente = filtro.cliente || null;
    filtro.desdeMonto = filtro.desdeMonto || null;

    const params = [filtro.cliente, filtro.desdeMonto];
    try {
      const res = await client.query<CuentaCorriente>('SELECT * FROM PUBLIC.BUSCAR_CUENTAS_CORRIENTES($1, $2)', params);
      const cuentas = res.rows.map((row) => {
        // Armamos los objetos necesarios para la clase Cuentas Corrientes
        const usuario: Usuario = plainToClass(Usuario, row, { excludeExtraneousValues: true });
        const cuentaCorriente: CuentaCorriente = plainToClass(CuentaCorriente, row, { excludeExtraneousValues: true });
        cuentaCorriente.usuario = usuario;
        return cuentaCorriente;
      });
      return cuentas;
    } catch (err) {
      logger.error('Error al consultar Cuentas Corrientes: ' + err);
      throw new Error('Error al consultar Cuentas Corrientes.');
    } finally {
      client.release();
    }
  }
  async consultarAllUsuarios(): Promise<Usuario[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<Usuario[]>('SELECT * FROM PUBLIC.USUARIO t WHERE t.activo = 1');
      const result: Usuario[] = plainToClass(Usuario, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al consultar todos los usuarios: ' + err);
      throw new Error('Error al consultar todos los usuarios.');
    } finally {
      client.release();
    }
  }

  async registrarCuentaCorriente(cuentaCorriente: CuentaCorriente): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [cuentaCorriente.usuario.id, cuentaCorriente.balanceTotal];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_CUENTA_CORRIENTE($1, $2)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al registrar Cuenta Corriente: ' + err);
      throw new Error('Error al registrar Cuenta Corriente.');
    } finally {
      client.release();
    }
  }

  async modificarCuentaCorriente(cuenta: CuentaCorriente): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [cuenta.id, cuenta.balanceTotal, cuenta.usuario.id, cuenta.fechaDesde];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.MODIFICAR_CUENTA_CORRIENTE($1, $2, $3, $4)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al modificar la Cuenta Corriente: ' + err);
      throw new Error('Error al modificar la Cuenta Corriente.');
    } finally {
      client.release();
    }
  }

  async eliminarCuentaCorriente(idCuentaCorriente: number): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [idCuentaCorriente];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.ELIMINAR_CUENTA_CORRIENTE($1)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al eliminar Cuenta Corriente: ' + err);
      throw new Error('Error al eliminar Cuenta Corriente.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para obtener los roles de un usuario determinado
   * @returns {Rol[]} - devuelve un array de strings de roles
   */
  async obtenerRolesUsuario(idUsuario: number): Promise<Rol[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<{ nrol: string; idrol: number }>(
        `SELECT r.nrol, r.idrol
             FROM PUBLIC.ROLES_POR_USUARIO rpu 
             JOIN PUBLIC.ROL r ON rpu.idrol = r.idrol 
             WHERE rpu.idusuario = $1 AND rpu.activo = 1`,
        [idUsuario]
      );

      const result: Rol[] = plainToClass(Rol, res.rows, {
        excludeExtraneousValues: true
      });

      return result;
    } catch (err) {
      logger.error('Error al consultar Roles: ' + err);
      throw new Error('Error al consultar Roles.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para obtener todos los roles
   * @returns {Rol[]} - devuelve un array de strings de roles
   */
  async obtenerRoles(): Promise<Rol[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<{ nrol: string; idrol: number }>(`SELECT r.nrol, r.idrol FROM PUBLIC.ROL r WHERE r.activo = 1`);
      const result: Rol[] = plainToClass(Rol, res.rows, {
        excludeExtraneousValues: true
      });

      return result;
    } catch (err) {
      logger.error('Error al consultar Roles: ' + err);
      throw new Error('Error al consultar Roles.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para obtener todos los motivos de licencia
   * @returns {Motivo[]} - devuelve un array de strings de motivos de licencia
   */
  async obtenerMotivosLicencia(): Promise<Motivo[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<{ nmotivolicencia: string; idmotivolicencia: number }>(
        `SELECT m.nmotivolicencia, m.idmotivolicencia FROM PUBLIC.MOTIVO_LICENCIA m WHERE m.activo = 1`
      );
      const result: Motivo[] = plainToClass(Motivo, res.rows, {
        excludeExtraneousValues: true
      });

      return result;
    } catch (err) {
      logger.error('Error al consultar Motivos de Licencia: ' + err);
      throw new Error('Error al consultar Motivos de Licencia.');
    } finally {
      client.release();
    }
  }

  async registrarLicencia(licencia: Licencia): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [licencia.idUsuario, licencia.fechaInicio, licencia.fechaFin, licencia.idMotivoLicencia, licencia.idEstadoLicencia, licencia.comentario, licencia.archivo.id];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_LICENCIA($1, $2, $3, $4, $5, $6, $7)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al registrar Licencia: ' + err);
      throw new Error('Error al registrar Licencia.');
    } finally {
      client.release();
    }
  }

  async eliminarLicencia(idLicencia: number): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [idLicencia];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.ELIMINAR_LICENCIA($1)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al eliminar Licencia: ' + err);
      throw new Error('Error al eliminar Licencia.');
    } finally {
      client.release();
    }
  }

  async consultarLicencias(filtro: FiltrosLicencias): Promise<Licencia[]> {
    const client = await PoolDb.connect();

    filtro.idUsuario = filtro.idUsuario || null;
    filtro.fecha = filtro.fecha || null;

    const params = [filtro.idUsuario, filtro.fecha];
    try {
      const res = await client.query('SELECT * FROM PUBLIC.BUSCAR_LICENCIAS($1, $2)', params);
      const licencias = res.rows.map((row) => {
        // Armamos los objetos necesarios para la clase Licencia
        const licencia: Licencia = plainToClass(Licencia, row, { excludeExtraneousValues: true });
        const usuario: Usuario = plainToClass(Usuario, row, { excludeExtraneousValues: true });
        const estadoLicencia: EstadoLicencia = plainToClass(EstadoLicencia, row, { excludeExtraneousValues: true });
        const motivo: Motivo = plainToClass(Motivo, row, { excludeExtraneousValues: true });
        const archivo: Archivo = plainToClass(Archivo, row, { excludeExtraneousValues: true });

        // Asignaciones
        licencia.usuario = usuario;
        licencia.estadoLicencia = estadoLicencia;
        licencia.motivo = motivo;
        licencia.archivo = archivo;

        return licencia;
      });

      return licencias;
    } catch (err) {
      logger.error('Error al consultar Licencias: ' + err);
      throw new Error('Error al consultar Licencias.');
    } finally {
      client.release();
    }
  }

  async obtenerEstadosLicencia(): Promise<EstadoLicencia[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<{ nestadolicencia: string; idestadolicencia: number }>(
        `SELECT e.nestadolicencia, e.idestadolicencia FROM PUBLIC.ESTADO_LICENCIA e WHERE e.activo = 1`
      );
      const result: EstadoLicencia[] = plainToClass(EstadoLicencia, res.rows, {
        excludeExtraneousValues: true
      });

      return result;
    } catch (err) {
      logger.error('Error al consultar Estados de Licencia: ' + err);
      throw new Error('Error al consultar Estados de Licencia.');
    } finally {
      client.release();
    }
  }

  async modificarLicencia(licencia: Licencia): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [licencia.id, licencia.idUsuario, licencia.fechaInicio, licencia.fechaFin, licencia.idMotivoLicencia, licencia.idEstadoLicencia, licencia.comentario];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.MODIFICAR_LICENCIA($1, $2, $3, $4, $5, $6, $7)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al modificar Licencia: ' + err);
      throw new Error('Error al modificar Licencia.');
    } finally {
      client.release();
    }
  }

  async buscarUltimosClientes(): Promise<Usuario[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<Usuario[]>('SELECT * FROM usuario where activo = 1 and idtipousuario = 2 ORDER BY idusuario DESC LIMIT 3');
      const result: Usuario[] = plainToClass(Usuario, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al consultar los ultimos clientes: ' + err);
      throw new Error('Error al consultar los ultimos clientes.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para obtener los logs de los ultimos 3 dias
   * @returns {UltimosMovimientos[]}
   */
  async buscarUltimosLogs(): Promise<UltimosMovimientos[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<UltimosMovimientos[]>('SELECT * FROM PUBLIC.buscar_ultimos_logs()');
      const result: UltimosMovimientos[] = plainToClass(UltimosMovimientos, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al buscar los ultimos logs. ' + err);
      throw new Error('Error al buscar los ultimos logs.');
    } finally {
      client.release();
    }
  }

  async recuperarContrasena(recuperarContrasena: RecuperarContrasena): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [recuperarContrasena.correo];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.EXISTE_USUARIO_CORREO($1)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al consultar correo para recuperar contraseña: ' + err);
      throw new Error('Error al consultar correo para recuperar contraseña.');
    } finally {
      client.release();
    }
  }

  async cambiarContrasena(recuperarContrasena: RecuperarContrasena): Promise<SpResult> {
    const client = await PoolDb.connect();

    // Hashear la contraseña antes de enviarla a la base de datos
    const contrasenaHashed = await argon2.hash(recuperarContrasena.contrasena, argonConfig);

    const params = [recuperarContrasena.correo, contrasenaHashed];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.CAMBIAR_CONTRASENA_USUARIO($1, $2)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al cambiar contraseña: ' + err);
      throw new Error('Error al cambiar contraseña.');
    } finally {
      client.release();
    }
  }
}
