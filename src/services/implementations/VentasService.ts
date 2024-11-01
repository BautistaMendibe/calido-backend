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
import { error } from 'winston';
import { IUsersRepository } from '../../repositories';
import { FiltroEmpleados } from '../../models/comandos/FiltroEmpleados';
import { FiltrosVentas } from '../../models/comandos/FiltroVentas';

/**
 * Servicio que tiene como responsabilidad
 * lo vinculado a la configuración
 */
@injectable()
export class VentasService implements IVentasService {
  private readonly _ventasRepository: IVentasRepository;
  private readonly _usuariosRepository: IUsersRepository;

  constructor(@inject(TYPES.VentasRepository) repository: IVentasRepository, @inject(TYPES.UsersRepository) userRepository: IUsersRepository) {
    this._ventasRepository = repository;
    this._usuariosRepository = userRepository;
  }

  public async registrarVentaConDetalles(venta: Venta): Promise<SpResult> {
    const client = await PoolDb.connect(); // Conectamos al cliente de la base de datos

    try {
      await client.query('BEGIN'); // Iniciamos la transacción

      // Registrar la venta y obtener el ID de la venta registrada
      const ventaResult: SpResult = await this.registrarVenta(venta, client);
      const ventaId: number = ventaResult.id;

      // Registrar detalles de venta para cada producto
      if (ventaId) {
        for (const producto of venta.productos) {
          const detalleResult: SpResult = await this.registrarDetalleVenta(producto, ventaId, client);

          // Si el detalleResult no es OK, lanzar un error
          if (detalleResult.mensaje !== 'OK') {
            throw new Error('Error al registrar el detalle de la venta.');
          }
        }
      } else {
        return ventaResult;
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

  public async facturarVentaConAfip(venta: Venta): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        if (venta.cliente?.id) {
          // buscar info del usuario vinculado a la venta
          const filtroCliente = new FiltroEmpleados();
          filtroCliente.id = venta.cliente.id;
          const usuarios = await this._usuariosRepository.consultarClientes(filtroCliente);
          const cliente = usuarios[0];
          cliente.domicilioString = cliente.domicilio.localidad?.nombre
            ? `${cliente.domicilio?.localidad?.nombre + ' ' + cliente.domicilio?.calle + ' ' + cliente.domicilio?.numero + ','}`
            : 'No registrado';
          // Asignar el usuario actualizado
          venta.cliente = cliente;
        } else {
          venta.cliente = new Usuario();
        }

        venta.fechaString = new Date(venta.fecha).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });

        const result = await this.llamarApiFacturacion(venta);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  // Funcion para hacer la llamada a la API de facturación
  private async llamarApiFacturacion(venta: Venta): Promise<SpResult> {
    const payload = {
      apitoken: process.env['API_TOKEN'],
      apikey: process.env['API_KEY'],
      usertoken: process.env['USER_TOKEN'],
      cliente: {
        documento_tipo: venta.cliente?.dni ? 'DNI' : 'OTRO',
        condicion_iva: venta.cliente?.condicionIva?.abreviatura ? venta.cliente?.condicionIva.abreviatura : 'CF',
        domicilio: venta.cliente.domicilioString,
        condicion_pago: venta.formaDePago.idAfip,
        documento_nro: venta.cliente?.dni ? venta.cliente.dni : '0',
        razon_social: venta.cliente.nombre + ' ' + venta.cliente.apellido,
        provincia: venta.cliente.domicilio.localidad?.provincia?.id ? venta.cliente.domicilio.localidad?.provincia?.id : '26',
        email: venta.cliente.mail ? venta.cliente.mail : '',
        envia_por_mail: venta.cliente.mail ? 'S' : 'N',
        rg5329: 'N'
      },
      comprobante: {
        rubro: 'Tienda de indumentaria',
        tipo: venta.facturacion.nombre,
        numero: venta.id,
        operacion: 'V',
        detalle: venta.productos.map((producto) => ({
          cantidad: producto.cantidadSeleccionada,
          afecta_stock: 'S',
          actualiza_precio: 'S',
          bonificacion_porcentaje: 0,
          producto: {
            descripcion: producto.nombre,
            codigo: producto.id,
            lista_precios: 'standard',
            leyenda: '',
            unidad_bulto: 1,
            alicuota: 21,
            precio_unitario_sin_iva: producto.precioSinIVA / 1.21,
            rg5329: 'N'
          }
        })),
        fecha: venta.fechaString,
        vencimiento: '12/12/2025',
        rubro_grupo_contable: 'Productos',
        total: venta.montoTotal,
        cotizacion: 1,
        moneda: 'PES',
        punto_venta: 679,
        tributos: {}
      }
    };

    try {
      const response = await axios.post('https://www.tusfacturas.app/app/api/v2/facturacion/nuevo', payload);

      if (response.data.error === 'N') {
        const comprobante = new ComprobanteResponse(response.data);
        return await this._ventasRepository.guardarComprobanteAfip(comprobante, venta);
      } else {
        console.error('Error en la facturación:', response.data.errores);
        throw new Error('Error al generar el comprobante: ' + response.data.errores.join(', '));
      }
    } catch (error) {
      console.error('Error en la llamada a la API de facturación:', error.message);
      throw new Error('Error al llamar a la API de facturación.');
    }
  }

  public async buscarVentas(filtros: FiltrosVentas): Promise<Venta[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._ventasRepository.buscarVentas(filtros);

        const ventas: Venta[] = await Promise.all(
          result.map(async (venta) => {
            venta.productos = await this.buscarProductosPorVenta(venta.id);
            return venta;
          })
        );

        resolve(ventas);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async buscarProductosPorVenta(idVenta: number): Promise<Producto[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._ventasRepository.buscarProductosPorVenta(idVenta);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async buscarVentasPorCC(idUsuario: number): Promise<Venta[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._ventasRepository.buscarVentasPorCC(idUsuario);

        const ventas: Venta[] = await Promise.all(
          result.map(async (venta) => {
            venta.productos = await this.buscarProductosPorVenta(venta.id);
            return venta;
          })
        );

        resolve(ventas);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async anularVenta(venta: Venta): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        this.llamarApiNotaCredito(venta).then(async (res) => {
          if (res.mensaje == 'OK') {
            const result = await this._ventasRepository.anularVenta(venta);
            resolve(result);
          }
        });
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  // Funcion para hacer la llamada a la API de facturación
  private async llamarApiNotaCredito(venta: Venta): Promise<SpResult> {
    const payload = {
      apitoken: process.env['API_TOKEN'],
      apikey: process.env['API_KEY'],
      usertoken: process.env['USER_TOKEN'],
      cliente: {
        documento_tipo: venta.cliente?.dni ? 'DNI' : 'OTRO',
        condicion_iva: venta.cliente?.condicionIva?.abreviatura ? venta.cliente?.condicionIva.abreviatura : 'CF',
        domicilio: venta.cliente.domicilioString,
        condicion_pago: venta.formaDePago.idAfip,
        documento_nro: venta.cliente?.dni ? venta.cliente.dni : '0',
        razon_social: venta.cliente.nombre + ' ' + venta.cliente.apellido,
        provincia: venta.cliente.domicilio.localidad?.provincia?.id ? venta.cliente.domicilio.localidad?.provincia?.id : '26',
        email: venta.cliente.mail ? venta.cliente.mail : '',
        envia_por_mail: venta.cliente.mail ? 'S' : 'N',
        rg5329: 'N'
      },
      comprobante: {
        rubro: 'Tienda de indumentaria',
        tipo: venta.facturacion.nombre,
        numero: venta.id,
        operacion: 'V',
        detalle: venta.productos.map((producto) => ({
          cantidad: producto.cantidadSeleccionada,
          afecta_stock: 'S',
          actualiza_precio: 'S',
          bonificacion_porcentaje: 0,
          producto: {
            descripcion: producto.nombre,
            codigo: producto.id,
            lista_precios: 'standard',
            leyenda: '',
            unidad_bulto: 1,
            alicuota: 21,
            precio_unitario_sin_iva: producto.precioSinIVA / 1.21,
            rg5329: 'N'
          }
        })),
        fecha: venta.fechaString,
        vencimiento: '12/12/2025',
        rubro_grupo_contable: 'Productos',
        total: venta.montoTotal,
        cotizacion: 1,
        moneda: 'PES',
        punto_venta: 679,
        tributos: {}
      }
    };

    try {
      const response = await axios.post('https://www.tusfacturas.app/app/api/v2/facturacion/nuevo', payload);

      if (response.data.error === 'N') {
        const comprobante = new ComprobanteResponse(response.data);
        return await this._ventasRepository.guardarComprobanteAfip(comprobante, venta);
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
