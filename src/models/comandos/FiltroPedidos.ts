import { Proveedor } from '../Proveedor';

export class FiltroPedidos {
  pedido?: number;
  proveedor?: Proveedor;
  fechaEmisionDesde?: Date;
  fechaEmisionHasta?: Date;
}
