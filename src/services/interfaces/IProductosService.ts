import { Producto } from '../../models/Producto';
import { SpResult } from '../../models';
import { FiltrosProductos } from '../../models/comandos/FiltroProductos';

export interface IProductosService {
  registrarProducto(producto: Producto): Promise<SpResult>;
  consultarProductos(filtro: FiltrosProductos): Promise<Producto[]>;
}
