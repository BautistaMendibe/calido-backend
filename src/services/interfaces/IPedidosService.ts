import { Pedido } from '../../models/Pedido';
import { SpResult } from '../../models';
import { FiltroPedidos } from '../../models/comandos/FiltroPedidos';
import { EstadoPedido } from '../../models/EstadoPedido';
import { OrdenDeCompraComando } from '../../models/comandos/OrdenesDeCompra.comando';

export interface IPedidosService {
  registrarPedido(pedido: Pedido): Promise<SpResult>;
  consultarPedidos(filtro: FiltroPedidos): Promise<Pedido[]>;
  eliminarPedido(idPedido: number): Promise<SpResult>;
  obtenerEstadosPedido(): Promise<EstadoPedido[]>;
  modificarPedido(pedido: Pedido): Promise<SpResult>;
  buscarOrdenesDeCompraHome(): Promise<OrdenDeCompraComando[]>;
}
