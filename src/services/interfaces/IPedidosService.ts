import { Pedido } from '../../models/Pedido';
import { SpResult } from '../../models';

export interface IPedidosService {
  registrarPedido(pedido: Pedido): Promise<SpResult>;
}
