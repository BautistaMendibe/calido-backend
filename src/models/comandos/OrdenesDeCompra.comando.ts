import { Expose } from 'class-transformer';

export class OrdenDeCompraComando {
  @Expose({ name: 'Id' })
  id: number;
  @Expose({ name: 'FechaPedido' })
  fechaPedido: Date;
  @Expose({ name: 'FechaEntrega' })
  fechaEntrega: Date;
  @Expose({ name: 'Total' })
  total: number;
  @Expose({ name: 'Proveedor' })
  proveedor: string;
  @Expose({ name: 'Estado' })
  estadoPedido: string;

  constructor(
    id: number,
    fechaPedido: Date,
    fechaEntrega: Date,
    total: number,
    proveedor: string,
    estadoPedido: string
  ) {
    this.id = id!;
    this.fechaPedido = fechaPedido!;
    this.fechaEntrega = fechaEntrega!;
    this.total = total!;
    this.proveedor = proveedor!;
    this.estadoPedido = estadoPedido!;
  }
}
