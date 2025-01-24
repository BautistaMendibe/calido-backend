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
import { IUsersRepository } from '../../repositories';
import { FiltroEmpleados } from '../../models/comandos/FiltroEmpleados';
import { FiltrosVentas } from '../../models/comandos/FiltroVentas';
import { VentasMensuales } from '../../models/comandos/VentasMensuales';
import { VentasDiariaComando } from '../../models/comandos/VentasDiariaComando';
import { FiltrosDetallesVenta } from '../../models/comandos/FiltroDetalleVenta';
import { DetalleVenta } from '../../models/DetalleVenta';

// variables para token API Sesion SIRO
let siroToken: string | null = null;
let siroTokenExpiration: Date | null = null;

/**
 * Servicio que tiene como responsabilidad
 * lo vinculado a las ventas
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
          const detalleResult: SpResult = await this.registrarDetalleVenta(venta, producto, ventaId, client);

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

  public async registrarDetalleVenta(venta: Venta, producto: Producto, idVenta: number, client: PoolClient): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._ventasRepository.registarDetalleVenta(venta, producto, idVenta, client);
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
          cliente.tipoDocumento = cliente.dni ? 'DNI' : cliente.cuit ? 'CUIT' : 'OTRO';
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
    const client = await PoolDb.connect();

    // Obtener fecha de vencimiento (fecha de venta + 10 días)
    const fechaVencimiento: string = new Date(new Date(venta.fecha).setDate(new Date(venta.fecha).getDate() + 10)).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    // Tenemos que obtener cuanto del total corresponde a un interés por tarjeta
    if (venta.interes > 0) {
      const conceptoInteres: Producto = new Producto();
      conceptoInteres.id = 9999;
      conceptoInteres.nombre = `Interés por financiación en ${venta.cantidadCuotas === 1 ? 'cuota' : 'cuotas'}. Plan ${venta.cantidadCuotas} ${
        venta.cantidadCuotas === 1 ? 'cuota' : 'cuotas'
      } (${venta.interes}% de interés)`;
      conceptoInteres.leyenda = `Aplica plan ${venta.cantidadCuotas} ${venta.cantidadCuotas === 1 ? 'cuota' : 'cuotas'}, con un ${venta.interes}% de interés.`;
      conceptoInteres.precioSinIVA = (venta.montoTotal * (venta.interes / (100 + venta.interes))) / 1.21;
      conceptoInteres.cantidadSeleccionada = 1;
      venta.productos.push(conceptoInteres);
    }

    const payload = {
      apitoken: process.env['API_TOKEN'],
      apikey: process.env['API_KEY'],
      usertoken: process.env['USER_TOKEN'],
      cliente: {
        documento_tipo: venta.cliente.tipoDocumento,
        condicion_iva: venta.cliente?.condicionIva?.abreviatura ? venta.cliente?.condicionIva.abreviatura : 'CF',
        domicilio: venta.cliente.domicilioString,
        condicion_pago: venta.formaDePago.idAfip,
        documento_nro: venta.cliente?.dni ? venta.cliente.dni : venta.cliente?.cuit ? venta.cliente.cuit : '0',
        razon_social: venta.cliente.nombre + ' ' + venta.cliente.apellido,
        provincia: venta.cliente.domicilio.localidad?.provincia?.id ? venta.cliente.domicilio.localidad?.provincia?.id : '26',
        email: venta.cliente.mail ? venta.cliente.mail : '',
        envia_por_mail: venta.cliente.mail ? 'S' : 'N',
        rg5329: 'N'
      },
      comprobante: {
        rubro: 'Tienda de indumentaria',
        tipo: venta.facturacion.nombre,
        operacion: 'V',
        detalle: venta.productos.map((producto) => ({
          cantidad: producto.cantidadSeleccionada,
          afecta_stock: 'S',
          actualiza_precio: 'S',
          bonificacion_porcentaje: producto.promocion ? producto.promocion.porcentajeDescuento : 0,
          producto: {
            descripcion: producto.nombre,
            codigo: producto.id,
            lista_precios: 'standard',
            leyenda: producto.leyenda ? producto.leyenda : '',
            unidad_bulto: 1,
            alicuota: 21,
            precio_unitario_sin_iva: producto.precioSinIVA,
            rg5329: 'N'
          }
        })),
        fecha: venta.fechaString,
        periodo_facturado_desde: venta.fechaString,
        periodo_facturado_hasta: venta.fechaString,
        vencimiento: fechaVencimiento,
        rubro_grupo_contable: 'Productos',
        total: venta.montoTotal,
        bonificacion: venta.bonificacion ? venta.bonificacion : 0,
        cotizacion: 1,
        moneda: 'PES',
        punto_venta: 679,
        tributos: {}
      }
    };

    try {
      const response = await axios.post('https://www.tusfacturas.app/app/api/v2/facturacion/nuevo', payload);

      if (response.data.error === 'N') {
        await client.query('BEGIN');

        const comprobante = new ComprobanteResponse(response.data);
        comprobante.fechaComprobante = new Date().toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });

        const guardarComprobante = await this._ventasRepository.guardarComprobanteAfip(comprobante, venta, client);

        if (guardarComprobante.mensaje == 'OK') {
          for (const producto of venta.productos) {
            if (producto.id !== 9999) {
              const actualizarStock: SpResult = await this.actualizarStockPorVenta(producto, venta.id, client);
            }
          }
        }
        await client.query('COMMIT');
        return guardarComprobante;
      } else {
        await client.query('ROLLBACK');
        console.error('Error en la facturación:', response.data.errores);
        throw new Error('Error al generar el comprobante: ' + response.data.errores.join(', '));
      }
    } catch (error) {
      console.error('Error en la llamada a la API de facturación:', error.message);
      throw new Error('Error al llamar a la API de facturación.');
    } finally {
      client.release();
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

  public async buscarVentasPaginadas(filtros: FiltrosVentas): Promise<Venta[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._ventasRepository.buscarVentasPaginadas(filtros);

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

  public async buscarVentasConFechaHora(fechaHora: string, fechaHoraCierre: string): Promise<Venta[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._ventasRepository.buscarVentasConFechaHora(fechaHora, fechaHoraCierre);
        resolve(result);
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
    const client = await PoolDb.connect();
    let result: SpResult = new SpResult();

    try {
      await client.query('BEGIN');

      if (venta.comprobanteAfip.comprobante_nro) {
        result = await this.llamarApiNotaCredito(venta, client);
      } else {
        result.mensaje = 'OK';
      }

      if (result.mensaje === 'OK') {
        const anularVentaResult = await this._ventasRepository.anularVenta(venta, client);
        if (anularVentaResult.mensaje === 'OK') {
          let todasActualizacionesExitosas = true;

          for (const producto of venta.productos) {
            if (producto.id !== 9999) {
              const actualizarStock: SpResult = await this.actualizarStockPorAnulacion(producto, venta.id, client);
              if (actualizarStock.mensaje !== 'OK') {
                todasActualizacionesExitosas = false;
                throw new Error(`Error al actualizar stock del producto con ID ${producto.id}`);
              }

              const actualizarDetalle: SpResult = await this.actualizarDetalleDeVentaPorAnulacion(producto, venta.id, client);
              if (actualizarDetalle.mensaje !== 'OK') {
                todasActualizacionesExitosas = false;
                throw new Error(`Error al actualizar detalle de la venta para el producto con ID ${producto.id}`);
              }
            }
          }

          // Si todas las actualizaciones fueron exitosas y formaDePago.id es 6, generar un movimiento de cuenta corriente
          if (todasActualizacionesExitosas && venta.formaDePago.id === 6) {
            const generarAnulacionCuentaCorriente: SpResult = await this.generarAnulacionCuentaCorriente(venta, client);
            if (generarAnulacionCuentaCorriente.mensaje !== 'OK') {
              throw new Error('Error al generar la anulación en cuenta corriente');
            }
          }
        } else {
          throw new Error('Error al anular la venta en el repositorio');
        }
      }

      await client.query('COMMIT');
      return result;
    } catch (e) {
      await client.query('ROLLBACK');
      logger.error('Transacción fallida: ' + e.message);
      throw new Error('Error al anular la venta y sus detalles.');
    } finally {
      client.release();
    }
  }

  public async anularVentaSinFacturacion(venta: Venta): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._ventasRepository.anularVentaSinFacturacion(venta);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async actualizarStockPorVenta(producto: Producto, idVenta: number, client: PoolClient): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._ventasRepository.actualizarStockPorVenta(producto, idVenta, client);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async actualizarStockPorAnulacion(producto: Producto, idVenta: number, client: PoolClient): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._ventasRepository.actualizarStockPorAnulacion(producto, idVenta, client);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async generarAnulacionCuentaCorriente(venta: Venta, client: PoolClient): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._ventasRepository.generarAnulacionCuentaCorriente(venta, client);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async actualizarDetalleDeVentaPorAnulacion(producto: Producto, idVenta: number, client: PoolClient): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._ventasRepository.actualizarDetalleDeVentaPorAnulacion(producto, idVenta, client);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async buscarCantidadVentasMensuales(): Promise<VentasMensuales[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._ventasRepository.buscarCantidadVentasMensuales();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async buscarVentasPorDiaYHora(): Promise<VentasDiariaComando[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._ventasRepository.buscarVentasPorDiaYHora();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  // Funcion para hacer la llamada a la API de facturación
  private async llamarApiNotaCredito(venta: Venta, client: PoolClient): Promise<SpResult> {
    const fechaHoy = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    // Obtener fecha de vencimiento (fecha de hoy + 10 días)
    const fechaVencimiento: string = new Date(new Date().setDate(new Date().getDate() + 10)).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    venta.notaCredito = venta.facturacion.nombre == 'FACTURA B' ? 'NOTA DE CREDITO B' : 'NOTA DE CREDITO A';

    const filtroCliente = new FiltroEmpleados();
    filtroCliente.id = venta.cliente.id;
    const usuarios = await this._usuariosRepository.consultarClientes(filtroCliente);
    const cliente = usuarios[0];
    cliente.domicilioString = cliente.domicilio.localidad?.nombre
      ? `${cliente.domicilio?.localidad?.nombre + ' ' + cliente.domicilio?.calle + ' ' + cliente.domicilio?.numero + ','}`
      : 'No registrado';
    venta.cliente = cliente;
    venta.cliente.tipoDocumento = venta.cliente.dni ? 'DNI' : venta.cliente.cuit ? 'CUIT' : 'OTRO';

    // Tenemos que obtener cuanto del total corresponde a un interés por tarjeta
    if (venta.interes > 0) {
      const conceptoInteres: Producto = new Producto();
      conceptoInteres.id = 9999;
      conceptoInteres.nombre = `Interés por financiación en ${venta.cantidadCuotas === 1 ? 'cuota' : 'cuotas'}. Plan ${venta.cantidadCuotas} ${
        venta.cantidadCuotas === 1 ? 'cuota' : 'cuotas'
      } (${venta.interes}% de interés)`;
      conceptoInteres.leyenda = `Aplica plan ${venta.cantidadCuotas} ${venta.cantidadCuotas === 1 ? 'cuota' : 'cuotas'}, con un ${venta.interes}% de interés.`;

      // Acumular el subtotal de los productos seleccionados para anular
      const subtotalAnulacion = venta.productosSeleccionadoParaAnular.reduce((total, producto) => total + Number(producto.subTotalVenta), 0);

      // Calcular el precio sin IVA del interés basado en el subtotal acumulado
      conceptoInteres.precioSinIVA = (subtotalAnulacion * (venta.interes / (100 + venta.interes))) / 1.21;

      conceptoInteres.cantidadAnulada = 1;
      venta.productosSeleccionadoParaAnular.push(conceptoInteres);
    }

    const payload = {
      apitoken: process.env['API_TOKEN'],
      apikey: process.env['API_KEY'],
      usertoken: process.env['USER_TOKEN'],
      cliente: {
        documento_tipo: venta.cliente.tipoDocumento,
        condicion_iva: venta.cliente?.condicionIva?.abreviatura ? venta.cliente?.condicionIva.abreviatura : 'CF',
        domicilio: venta.cliente.domicilioString ? venta.cliente.domicilioString : 'No registrado',
        condicion_pago: venta.formaDePago.idAfip,
        documento_nro: venta.cliente?.dni ? venta.cliente.dni : venta.cliente?.cuit ? venta.cliente.cuit : '0',
        razon_social: venta.cliente.nombre + ' ' + venta.cliente.apellido,
        provincia: venta.cliente.domicilio?.localidad?.provincia?.id ? venta.cliente.domicilio?.localidad?.provincia?.id : '26',
        email: venta.cliente.mail ? venta.cliente.mail : '',
        envia_por_mail: venta.cliente.mail ? 'S' : 'N',
        rg5329: 'N'
      },
      comprobante: {
        rubro: 'Tienda de indumentaria',
        tipo: venta.notaCredito,
        operacion: 'V',
        detalle: venta.productosSeleccionadoParaAnular.map((producto) => ({
          cantidad: producto.cantidadAnulada,
          afecta_stock: 'S',
          actualiza_precio: 'S',
          bonificacion_porcentaje: producto.promocion ? producto.promocion.porcentajeDescuento : 0,
          producto: {
            descripcion: producto.nombre,
            codigo: producto.id,
            lista_precios: 'standard',
            leyenda: producto.leyenda ? producto.leyenda : '',
            unidad_bulto: 1,
            alicuota: 21,
            precio_unitario_sin_iva: producto.precioSinIVA,
            rg5329: 'N'
          }
        })),
        fecha: fechaHoy,
        periodo_facturado_desde: fechaHoy,
        periodo_facturado_hasta: fechaHoy,
        vencimiento: fechaVencimiento,
        rubro_grupo_contable: 'Productos',
        total: venta.totalAnulado,
        bonificacion: venta.bonificacion ? venta.bonificacion : 0,
        comprobantes_asociados: [
          {
            tipo_comprobante: venta.facturacion.nombre,
            punto_venta: 679,
            numero: venta.comprobanteAfip.comprobante_nro.toString().slice(-8),
            comprobante_fecha: venta.comprobanteAfip.fechaComprobante,
            cuit: 30000000007
          }
        ],
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
        return await this._ventasRepository.modificarComprobanteAfip(comprobante, venta, client);
      } else {
        console.error('Error en la facturación:', response.data.errores);
        throw new Error('Error al generar el comprobante: ' + response.data.errores.join(', '));
      }
    } catch (error) {
      console.error('Error en la llamada a la API de facturación:', error.message);
      throw new Error('Error al llamar a la API de facturación.');
    }
  }

  public async cancelarVenta(venta: Venta): Promise<SpResult> {
    const client = await PoolDb.connect();
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._ventasRepository.cancelarVenta(venta, client);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      } finally {
        client.release();
      }
    });
  }

  public async cancelarVentaParcialmente(venta: Venta): Promise<SpResult> {
    const client = await PoolDb.connect();
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._ventasRepository.cancelarVentaParcialmente(venta, client);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      } finally {
        client.release();
      }
    });
  }

  // Funcion para hacer la llamada a la API de SIRO (definir si separar en dos funciones)
  public async pagarConSIROQR(venta: Venta): Promise<SpResult> {
    //console.log(venta.cliente.id.toString().padStart(9, '0'));

    if (venta.cliente.id == -1) {
      venta.cliente.id = 0;
    }

    try {
      const numeroVentaMasAlto = await this._ventasRepository.obtenerNumeroVentaMasAlto();
      //console.log('Número de venta más alto + 1:', numeroVentaMasAlto + 1);
      //console.log('Número de venta más alto + 1:', (numeroVentaMasAlto + 1).toString().padStart(20, '0'));
      //console.log(venta.montoTotal);
      const token = await this.obtenerTokenSIRO();
      // llamar a API Sesion para que se cargue solo 20233953270 Lei9PkpoPq
      const response = await axios.post(
        'https://siropagos.bancoroela.com.ar/api/Pago/QREstatico',
        {
          nro_terminal: 'N1', // hardcodeo por no tener distintas cajas
          nro_cliente_empresa: venta.cliente.id.toString().padStart(9, '0') + '5150058293', // al id del cliente lo transformo para que sea de 9 digitos + cuenta de prueba
          nro_comprobante: (numeroVentaMasAlto + 1).toString().padStart(20, '0'), // lo armo con el id venta transformado para 20 digitos
          Importe: 1, // hardcodeo para NO pagar de verdad (venta.montoTotal) consultar estos valores
          URL_OK: 'https://www.youtube.com/',
          URL_ERROR: 'https://www.youtube.com/error',
          IdReferenciaOperacion: 'QRE' + (numeroVentaMasAlto + 1).toString()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Aquí se incluye el token en el header
            'Content-Type': 'application/json'
          }
        }
      );
      //console.log(response.data);
      return {
        ...response.data, // Mantiene los datos originales
        IdReferenciaOperacion: 'QRE' + (numeroVentaMasAlto + 1).toString() // Incluye el ID en el retorno
      };
    } catch (error) {
      //console.error('Error al crear el pago:', error.response?.data || error.message);
      throw new Error('Error al crear la intención de pago.');
    }
  }

  private async obtenerTokenSIRO(): Promise<string> {
    // Verifica si el token es válido
    if (siroToken && siroTokenExpiration && siroTokenExpiration > new Date()) {
      return siroToken; // Devuelve el token existente si es válido
    }

    // Si no hay token válido, solicita uno nuevo
    try {
      const response = await axios.post('https://apisesionh.bancoroela.com.ar/auth/sesion', {
        // Parámetros de autenticación según la API
        Usuario: '20233953270',
        Password: 'Lei9PkpoPq'
      });

      // Extraer el token y la duración de validez
      siroToken = response.data.access_token; // Almacenar el "access_token"
      const expiresIn = response.data.expires_in; // Duración en segundos (ejemplo: 3599)

      // Calcular y almacenar la fecha/hora de expiración del token (menos un segundo)
      siroTokenExpiration = new Date(new Date().getTime() + (expiresIn - 1) * 1000);
      //console.log(siroToken);
      //console.log(siroTokenExpiration);
      return siroToken;
    } catch (error) {
      //console.error('Error al obtener el token de SIRO:', error.message);
      throw new Error('No se pudo obtener el token de SIRO.');
    }
  }

  // Funcion para hacer la llamada a la API consulta de SIRO
  public async consultaPagoSIROQR(IdReferenciaOperacion: string): Promise<SpResult> {
    //console.log(IdReferenciaOperacion);
    //console.log(new Date(new Date().getTime() - (3 * 60 * 60 * 1000 + 10 * 60 * 1000)).toISOString());
    //console.log(new Date(new Date().getTime() - 3 * 60 * 60 * 1000 + 1000).toISOString());
    try {
      const token = await this.obtenerTokenSIRO();
      // llamar a API Sesion para que se cargue solo 20233953270 Lei9PkpoPq
      const response = await axios.post(
        'https://siropagos.bancoroela.com.ar/api/Pago/Consulta',
        {
          FechaDesde: new Date(new Date().getTime() - (3 * 60 * 60 * 1000 + 10 * 60 * 1000)).toISOString(), // 10 minutos menos
          FechaHasta: new Date(new Date().getTime() - 3 * 60 * 60 * 1000 + 1000).toISOString(), // 1 segundo mas
          idReferenciaOperacion: IdReferenciaOperacion,
          nro_terminal: 'N1'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Aquí se incluye el token en el header
            'Content-Type': 'application/json'
          }
        }
      );
      //console.log('respuesta:', response.data);
      return response.data; // Devuelve la respuesta de la API
    } catch (error) {
      //console.error('Error al consultar el pago:', error.response?.data || error.message);
      throw new Error('Error al consultar el pago.');
    }
  }

  public async consultarDetallesVenta(filtro: FiltrosDetallesVenta): Promise<DetalleVenta[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._ventasRepository.consultarDetallesVenta(filtro);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }
}
