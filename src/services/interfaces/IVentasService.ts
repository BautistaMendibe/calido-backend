import { SpResult } from '../../models';
import { Venta } from '../../models/Venta';
import { Producto } from '../../models/Producto';

export interface IVentasService {
  registrarVenta(venta: Venta): Promise<SpResult>;
  registrarDetalleVenta(producto: Producto, idVenta: number): Promise<SpResult>;
}
