import { Proveedor } from '../Proveedor';
import { Usuario } from '../Usuario';

export class FiltrosComprobantes {
  comprobante?: number;
  proveedor?: Proveedor;
  fechaEmisionDesde?: Date;
  fechaEmisionHasta?: Date;
  responsable?: Usuario;
}
