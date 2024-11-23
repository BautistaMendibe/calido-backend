import { Producto } from '../../models/Producto';
import { SpResult } from '../../models';
import { FiltrosProductos } from '../../models/comandos/FiltroProductos';
import { TipoProducto } from '../../models/TipoProducto';
import { DetalleProducto } from '../../models/DetalleProducto';
import { FiltrosDetallesProductos } from '../../models/comandos/FiltroDetallesProductos';
import { MovimientoProducto } from '../../models/MovimientoProducto';

export interface IProductosService {
  registrarProducto(producto: Producto): Promise<SpResult>;
  consultarProductos(filtro: FiltrosProductos): Promise<Producto[]>;
  obtenerTipoProductos(): Promise<TipoProducto[]>;
  modificarProducto(producto: Producto): Promise<SpResult>;
  registrarDetalleProducto(detalle: DetalleProducto): Promise<SpResult>;
  modificarDetalleProducto(detalle: DetalleProducto): Promise<SpResult>;
  consultarDetallesProductos(filtro: FiltrosDetallesProductos): Promise<DetalleProducto[]>;
  eliminarDetalleProducto(idDetalleProducto: number): Promise<SpResult>;
  consultarMovimientosPorProducto(idProducto: number): Promise<MovimientoProducto[]>;
  consultarProductosConStockLimitado(): Promise<Producto[]>;
}
