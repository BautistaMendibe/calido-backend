import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import { SpResult } from '../models';
import PoolDb from '../data/db';
import { plainToClass } from 'class-transformer';
import { Usuario } from '../models/Usuario';
import { Provincia } from '../models/Provincia';
import { Proveedor } from '../models/Proveedor';
import { Localidad } from '../models/Localidad';
const jwt = require('jsonwebtoken');
const secretKey = 'secret';

/**
 * Interfaz del repositorio de usuarios
 */
export interface IDomicilioRepository {
  obtenerProvincias(): Promise<Provincia[]>;
  obtenerLocalidadesPorProvincia(idProvincia: number): Promise<Localidad[]>;
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
      const res = await client.query<Provincia[]>('SELECT * FROM PUBLIC.PROVINCIA');
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
      const res = await client.query<Localidad[]>(`SELECT * FROM PUBLIC.LOCALIDAD WHERE idprovincia = ${idProvincia}`);
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
}
