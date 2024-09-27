import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { logger } from '../../logger/CustomLogger';
import { TYPES } from '../types/types';
import { IVentasService } from '../interfaces/IVentasService';
import { IVentasRepository } from '../../repositories/VentasRepository';
import { Venta } from '../../models/Venta';
import { SpResult } from '../../models';
import { Producto } from '../../models/Producto';
import { buscarUsuariosClientes } from '../../controllers/VentasController';
import { Usuario } from '../../models/Usuario';
import { FormaDePago } from '../../models/FormaDePago';
import PoolDb from '../../data/db';
import { PoolClient } from 'pg';
import { CondicionIva } from '../../models/CondicionIva';

/**
 * Servicio que tiene como responsabilidad
 * lo vinculado a la configuración
 */
@injectable()
export class VentasService implements IVentasService {
  private readonly _ventasRepository: IVentasRepository;

  constructor(@inject(TYPES.VentasRepository) repository: IVentasRepository) {
    this._ventasRepository = repository;
  }

  public async registrarVentaConDetalles(venta: Venta): Promise<SpResult> {
    const client = await PoolDb.connect(); // Conectamos al cliente de la base de datos

    try {
      await client.query('BEGIN'); // Iniciamos la transacción

      // Registrar la venta y obtener el ID de la venta registrada
      const ventaResult: SpResult = await this.registrarVenta(venta, client);
      const ventaId: number = ventaResult.id;

      // Registrar detalles de venta para cada producto
      for (const producto of venta.productos) {
        const detalleResult: SpResult = await this.registrarDetalleVenta(producto, ventaId, client);

        // Si el detalleResult no es OK, lanzar un error
        if (detalleResult.mensaje !== 'OK') {
          throw new Error('Error al registrar el detalle de la venta.');
        }
      }

      await client.query('COMMIT'); // Confirmamos la transacción si salió bien
      return ventaResult;
    } catch (e) {
      await client.query('ROLLBACK'); // Revertimos la transacción en caso de error
      logger.error('Transacción fallida: ' + e.message);
      throw new Error('Error al registrar la venta y sus detalles.');
    } finally {
      client.release(); // Liberamos el cliente de la base de datos
    }
  }

  public async registrarVenta(venta: Venta, client: PoolClient): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._ventasRepository.registarVenta(venta, client);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async registrarDetalleVenta(producto: Producto, idVenta: number, client: PoolClient): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._ventasRepository.registarDetalleVenta(producto, idVenta, client);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async buscarUsuariosClientes(): Promise<Usuario[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._ventasRepository.buscarUsuariosClientes();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async buscarFormasDePago(): Promise<FormaDePago[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._ventasRepository.buscarFormasDePago();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async obtenerCondicionesIva(): Promise<CondicionIva[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._ventasRepository.obtenerCondicionesIva();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }
}
