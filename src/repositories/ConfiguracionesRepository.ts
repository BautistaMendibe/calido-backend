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
  registrarConfiguracion(configuracion: Configuracion): Promise<SpResult>;
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
      configuracion.domicilioComercial,
      configuracion.cuit,
      configuracion.fechaInicioActividades,
      configuracion.condicionIva,
      configuracion.logo,
      configuracion.contrasenaInstagram,
      configuracion.usuarioInstagram
    ];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.MODIFICAR_CONFIGURACION($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al modificar la promoción: ' + err);
      throw new Error('Error al modificar la promoción.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para registar una configuración
   * @param {Configuracion} configuracion
   * @returns {SpResult}
   */
  async registrarConfiguracion(configuracion: Configuracion): Promise<SpResult> {
    const client = await PoolDb.connect();
    // TODO Editar esto para que quede bien los params
    const params = [
      configuracion.id,
      configuracion.idUsuario,
      configuracion.razonSocial,
      configuracion.domicilioComercial,
      configuracion.cuit,
      configuracion.fechaInicioActividades,
      configuracion.condicionIva,
      configuracion.logo,
      configuracion.contrasenaInstagram,
      configuracion.usuarioInstagram
    ];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_PROMOCION_PRODUCTO($1, $2, $3)', params);
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
}
