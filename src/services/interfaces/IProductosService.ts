import { Producto } from '../../models/Producto';
import { SpResult } from '../../models';
import { FiltrosProductos } from '../../models/comandos/FiltroProductos';
import { TipoProducto } from '../../models/TipoProducto';
import { Proveedor } from '../../models/Proveedor';

export interface IProductosService {
  registrarProducto(producto: Producto): Promise<SpResult>;
  consultarProductos(filtro: FiltrosProductos): Promise<Producto[]>;
  obtenerTipoProductos(): Promise<TipoProducto[]>;
  modificarProducto(producto: Producto): Promise<SpResult>;
}
