import { Expose } from 'class-transformer';

export class DetallePedido {
  @Expose({ name: 'iddetallepedido' })
  id: number;
  @Expose({ name: 'cantidad' })
  cantidad: number;
  @Expose({ name: 'subtotal' })
  subTotal: number;
  @Expose({ name: 'idpedido' })
  idpedido: number;
  @Expose({ name: 'idproducto' })
  idproducto: number;
  @Expose({ name: 'idestadodetallepedido' })
  idestadodetallepedido: number;

  constructor(id?: number, cantidad?: number, subTotal?: number, idpedido?: number, idproducto?: number, idestadodetallepedido?: number) {
    this.id = id ? id : null;
    this.cantidad = cantidad ? cantidad : null;
    this.subTotal = subTotal ? subTotal : null;
    this.idpedido = idpedido ? idpedido : null;
    this.idproducto = idproducto ? idproducto : null;
    this.idestadodetallepedido = idestadodetallepedido ? idestadodetallepedido : null;
  }
}
