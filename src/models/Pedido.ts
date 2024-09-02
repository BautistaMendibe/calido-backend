import { Expose } from 'class-transformer';
import { DetallePedido } from './DetallePedido';
import { Proveedor } from './Proveedor';
import { Transporte } from './Transporte';
import { EstadoPedido } from './EstadoPedido';

export class Pedido {
  @Expose({ name: 'idpedido' })
  id: number;
  @Expose({ name: 'montoenvio' })
  montoEnvio: number;
  @Expose({ name: 'fechapedido' })
  fechaPedido: Date;
  @Expose({ name: 'fechaentrega' })
  fechaEntrega: Date;
  @Expose({ name: 'idestadopedido' })
  idEstadoPedido: number;
  @Expose({ name: 'idtransporte' })
  idTransporte: number;
  @Expose({ name: 'idproveedor' })
  idProveedor: number;
  @Expose({ name: 'descuento' })
  descuento: number;
  @Expose({ name: 'impuesto' })
  impuesto: number;
  @Expose({ name: 'observaciones' })
  observaciones: string;
  @Expose({ name: 'total' })
  total: number;

  detallePedido: DetallePedido[];
  proveedor: Proveedor;
  transporte: Transporte;
  estadoPedido: EstadoPedido;

  constructor(
    id?: number,
    montoEnvio?: number,
    fechaPedido?: Date,
    fechaEntrega?: Date,
    idEstadoPedido?: number,
    idTransporte?: number,
    idProveedor?: number,
    descuento?: number,
    impuesto?: number,
    observaciones?: string,
    total?: number,
    detallePedido?: DetallePedido[],
    proveedor?: Proveedor,
    transporte?: Transporte,
    estadoPedido?: EstadoPedido
  ) {
    this.id = id ? id : null;
    this.montoEnvio = montoEnvio ? montoEnvio : null;
    this.fechaPedido = fechaPedido ? fechaPedido : null;
    this.fechaEntrega = fechaEntrega ? fechaEntrega : null;
    this.idEstadoPedido = idEstadoPedido ? idEstadoPedido : null;
    this.idTransporte = idTransporte ? idTransporte : null;
    this.idProveedor = idProveedor ? idProveedor : null;
    this.descuento = descuento ? descuento : null;
    this.impuesto = impuesto ? impuesto : null;
    this.observaciones = observaciones ? observaciones : null;
    this.total = total ? total : null;
    this.detallePedido = detallePedido ? detallePedido : null;
    this.proveedor = proveedor ? proveedor : null;
    this.transporte = transporte ? transporte : null;
    this.estadoPedido = estadoPedido ? estadoPedido : null;
  }
}
