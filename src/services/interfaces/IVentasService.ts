import { SpResult } from '../../models';
import { Venta } from '../../models/Venta';
import { Producto } from '../../models/Producto';
import { Usuario } from '../../models/Usuario';
import { FormaDePago } from '../../models/FormaDePago';
import { PoolClient } from 'pg';
import { CondicionIva } from '../../models/CondicionIva';
import { TipoFactura } from '../../models/TipoFactura';
import { FiltrosVentas } from '../../models/comandos/FiltroVentas';
import { VentasMensuales } from '../../models/comandos/VentasMensuales';
import { VentasDiariaComando } from '../../models/comandos/VentasDiariaComando';
import { FiltrosDetallesVenta } from '../../models/comandos/FiltroDetalleVenta';
import { DetalleVenta } from '../../models/DetalleVenta';

export interface IVentasService {
  registrarVenta(venta: Venta, client: PoolClient): Promise<SpResult>;
  registrarDetalleVenta(venta: Venta, producto: Producto, idVenta: number, client: PoolClient): Promise<SpResult>;
  buscarUsuariosClientes(): Promise<Usuario[]>;
  buscarFormasDePago(): Promise<FormaDePago[]>;
  obtenerCondicionesIva(): Promise<CondicionIva[]>;
  obtenerTipoFacturacion(): Promise<TipoFactura[]>;
  facturarVentaConAfip(venta: Venta): Promise<SpResult>;
  buscarVentas(filtros: FiltrosVentas): Promise<Venta[]>;
  buscarVentasPaginadas(filtros: FiltrosVentas): Promise<Venta[]>;
  buscarProductosPorVenta(idVenta: number): Promise<Producto[]>;
  buscarVentasPorCC(idUsuario: number): Promise<Venta[]>;
  anularVenta(venta: Venta): Promise<SpResult>;
  anularVentaSinFacturacion(venta: Venta): Promise<SpResult>;
  actualizarStockPorVenta(producto: Producto, idVenta: number, client: PoolClient): Promise<SpResult>;
  actualizarStockPorAnulacion(producto: Producto, idVenta: number, client: PoolClient): Promise<SpResult>;
  pagarConSIROQR(venta: Venta): Promise<SpResult>;
  consultaPagoSIROQR(IdReferenciaOperacion: string): Promise<SpResult>;
  buscarVentasConFechaHora(fechaHora: string, fechaHoraCierre: string): Promise<Venta[]>;
  buscarCantidadVentasMensuales(): Promise<VentasMensuales[]>;
  buscarVentasPorDiaYHora(): Promise<VentasDiariaComando[]>;
  cancelarVenta(venta: Venta): Promise<SpResult>;
  cancelarVentaParcialmente(venta: Venta): Promise<SpResult>;
  consultarDetallesVenta(filtro: FiltrosDetallesVenta): Promise<DetalleVenta[]>;
}
