import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import PoolDb from '../data/db';
import { plainToClass } from 'class-transformer';
import { Configuracion } from '../models/Configuracion';
import { SpResult } from '../models';
import { Usuario } from '../models/Usuario';

/**
 * Interfaz del repositorio de Configuraciones
 */
export interface IConfiguracionesRepository {
  consultarConfiguraciones(): Promise<Configuracion>;
  modificarConfiguracion(configuracion: Configuracion): Promise<SpResult>;
  registrarConfiguracion(): Promise<SpResult>;
  existeConfiguracion(): Promise<boolean>;
  obtenerSuperusuario(): Promise<string>;
}

/**
 * Repositorio de alta, modificacion y consultas de configuraciones
 */
@injectable()
export class ConfiguracionesRepository implements IConfiguracionesRepository {
  /**
   * Método asíncrono para consultar la fila configuración
   * @returns {Configuracion} la única fila con configuraciones
   */
  async consultarConfiguraciones(): Promise<Configuracion> {
    const client = await PoolDb.connect();

    try {
      const res = await client.query<Configuracion>('SELECT c.*, u.nusuario FROM PUBLIC.CONFIGURACION c JOIN PUBLIC.USUARIO u ON c.idusuario = u.idusuario;');

      const configuraciones = res.rows.map((row) => {
        const usuario: Usuario = plainToClass(Usuario, row, { excludeExtraneousValues: true });
        const configuracion: Configuracion = plainToClass(Configuracion, row, { excludeExtraneousValues: true });
        configuracion.usuario = usuario;

        return configuracion;
      });

      return configuraciones[0];
    } catch (err) {
      logger.error('Error al consultar Configuraciones: ' + err);
      throw new Error('Error al consultar Configuraciones.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para modificar los datos de las configuraciones
   * @param {Configuracion} configuracion
   * @returns {SpResult}
   */
  async modificarConfiguracion(configuracion: Configuracion): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [
      configuracion.id,
      configuracion.idUsuario,
      configuracion.razonSocial,
      configuracion.cuit,
      configuracion.fechaInicioActividades,
      configuracion.condicionIva,
      configuracion.logo,
      configuracion.contrasenaInstagram,
      configuracion.usuarioInstagram,
      configuracion.calle,
      configuracion.numero,
      configuracion.ciudad,
      configuracion.provincia,
      configuracion.codigoPostal,
      configuracion.facturacionAutomatica ? 'S' : 'N',
      configuracion.montoConsumidorFinal
    ];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.MODIFICAR_CONFIGURACION($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al modificar la configuración: ' + err);
      throw new Error('Error al modificar la configuración.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para registar una configuración
   * @param {Configuracion} configuracion
   * @returns {SpResult}
   */
  async registrarConfiguracion(): Promise<SpResult> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_CONFIGURACION()');
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al registrar Configuracion: ' + err);
      throw new Error('Error al registrar Configuracion.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para determinar si existe o no una fila configuración
   * @returns Promise<boolean>
   */
  async existeConfiguracion(): Promise<boolean> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query('SELECT 1 FROM PUBLIC.CONFIGURACION LIMIT 1');
      return res.rowCount > 0;
    } catch (err) {
      logger.error('Error al verificar la existencia de configuración: ' + err);
      throw new Error('Error al verificar la existencia de configuración.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para determinar el id del superusuario
   * @returns Promise<string>
   */
  async obtenerSuperusuario(): Promise<string> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query('SELECT idusuario FROM PUBLIC.CONFIGURACION LIMIT 1');
      if (res.rowCount > 0) {
        return res.rows[0].idusuario.toString();
      } else {
        throw new Error('No se encontró ninguna configuración.');
      }
    } catch (err) {
      logger.error('Error al obtener el ID del superusuario: ' + err);
      throw new Error('Error al obtener el ID del superusuario.');
    } finally {
      client.release();
    }
  }
}
