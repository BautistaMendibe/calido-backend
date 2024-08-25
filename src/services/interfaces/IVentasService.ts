import { SpResult } from '../../models';
import { Venta } from '../../models/Venta';

export interface IVentasService {
  registrarVenta(venta: Venta): Promise<SpResult>;
}
