import { Proveedor } from '../Proveedor';
import { EstadoPedido } from '../EstadoPedido';

export class FiltroPedidos {
  pedido?: number;
  proveedor?: Proveedor;
  fechaEmisionDesde?: Date;
  fechaEmisionHasta?: Date;
  estado?: EstadoPedido;
}
