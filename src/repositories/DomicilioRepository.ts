import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import { SpResult } from '../models';
import PoolDb from '../data/db';
import { plainToClass } from 'class-transformer';
import { Usuario } from '../models/Usuario';
import { Provincia } from '../models/Provincia';
import { Proveedor } from '../models/Proveedor';
import { Localidad } from '../models/Localidad';
import { Domicilio } from '../models/Domicilio';
const jwt = require('jsonwebtoken');
const secretKey = 'secret';

/**
 * Interfaz del repositorio de usuarios
 */
export interface IDomicilioRepository {
  obtenerProvincias(): Promise<Provincia[]>;
  obtenerLocalidadesPorProvincia(idProvincia: number): Promise<Localidad[]>;
  registrarDomicilio(proveedor: Proveedor): Promise<number>;
}

/**
 * Repositorio encargado de manejar el domicilio
 */
@injectable()
export class DomicilioRepository implements IDomicilioRepository {
  /**
   * Método asíncrono para obtener las provincias listadas
   * @returns {Provincia[]} - devuelve un array de Provincias
   */
  async obtenerProvincias(): Promise<Provincia[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<Provincia[]>('SELECT * FROM PUBLIC.PROVINCIA p AND p.activo = 1');
      const result: Provincia[] = plainToClass(Provincia, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al consultar Provincias: ' + err);
      throw new Error('Error al consultar Provincias.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para obtener las localidades listadas de una determinada provincia
   * @param {idProvincia}
   * @returns {Localidad[]} - devuelve un array de Localidad
   */
  async obtenerLocalidadesPorProvincia(idProvincia: number): Promise<Localidad[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<Localidad[]>(`SELECT * FROM PUBLIC.LOCALIDAD l WHERE idprovincia = ${idProvincia} AND l.activo = 1`);
      const result: Localidad[] = plainToClass(Localidad, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al consultar Localidades: ' + err);
      throw new Error('Error al consultar Localidades.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para registar el domicilio y retornar el id
   * @param {Proveedor}
   * @returns {SpResult} - devuelve el id del domicilio dentro de un Sp result
   */
  async registrarDomicilio(proveedor: Proveedor): Promise<number> {
    const client = await PoolDb.connect();
    const params = [proveedor.domicilio.calle, proveedor.domicilio.numero, proveedor.domicilio.localidad.id];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_DOMICILIO($1, $2, $3)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result.id;
    } catch (err) {
      logger.error('Error al registar el domicilio ' + err);
      throw new Error('Error al registar el domicilio');
    } finally {
      client.release();
    }
  }
}
