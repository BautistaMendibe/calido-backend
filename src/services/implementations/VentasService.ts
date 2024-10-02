import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { logger } from '../../logger/CustomLogger';
import { TYPES } from '../types/types';
import { IVentasService } from '../interfaces/IVentasService';
import { IVentasRepository } from '../../repositories/VentasRepository';
import { Venta } from '../../models/Venta';
import { SpResult } from '../../models';
import { Producto } from '../../models/Producto';
import { Usuario } from '../../models/Usuario';
import { FormaDePago } from '../../models/FormaDePago';
import PoolDb from '../../data/db';
import { PoolClient } from 'pg';
import { CondicionIva } from '../../models/CondicionIva';
import { TipoFactura } from '../../models/TipoFactura';
import axios from 'axios';
import { ComprobanteResponse } from '../../models/ComprobanteResponse';

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

  public async obtenerTipoFacturacion(): Promise<TipoFactura[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._ventasRepository.obtenerTipoFacturacion();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async facturarVentaConAfip(venta: Venta): Promise<ComprobanteResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.llamarApiFacturacion(venta);
        //const result = await this._ventasRepository.obtenerTipoFacturacion();
        //resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  // Funcion para hacer la llamada a la API de facturación
  private async llamarApiFacturacion(venta: Venta): Promise<ComprobanteResponse> {
    const payload = {
      apitoken: process.env['API_TOKEN'],
      apikey: process.env['API_KEY'],
      usertoken: process.env['USER_TOKEN'],
      cliente: {
        documento_tipo: 'DNI',
        condicion_iva: 'CF',
        domicilio: 'Av Sta Fe 23132',
        condicion_pago: '201',
        documento_nro: '111132333',
        razon_social: 'Juan Pedro KJL',
        provincia: '2',
        email: 'email@dominio.com',
        envia_por_mail: 'N',
        rg5329: 'N'
      },
      comprobante: {
        rubro: 'Servicio web',
        tipo: 'FACTURA B',
        numero: 2134,
        operacion: 'V',
        detalle: venta.productos.map(producto => ({
          cantidad: 1,
          afecta_stock: 'S',
          actualiza_precio: 'S',
          bonificacion_porcentaje: 0,
          producto: {
            descripcion: 'Hosting pagina web',
            codigo: 37,
            lista_precios: 'standard',
            leyenda: '',
            unidad_bulto: 1,
            alicuota: 21,
            precio_unitario_sin_iva: 145,
            rg5329: 'N'
          }
        })),
        fecha: '02/10/2024',
        vencimiento: '02/11/2024',
        rubro_grupo_contable: 'Sevicios',
        total: 175.45,
        cotizacion: 1,
        moneda: 'PES',
        punto_venta: 679,
        tributos: {}
      }
    };

    try {
      const response = await axios.post('https://www.tusfacturas.app/app/api/v2/facturacion/nuevo', payload);

      if (response.data.error === 'N') {
        console.log('Comprobante guardado correctamente:', response.data.rta);
        return new ComprobanteResponse(response.data);
      } else {
        console.error('Error en la facturación:', response.data.errores);
        throw new Error('Error al generar el comprobante: ' + response.data.errores.join(', '));
      }
    } catch (error) {
      console.error('Error en la llamada a la API de facturación:', error.message);
      throw new Error('Error al llamar a la API de facturación.');
    }
  }
}
