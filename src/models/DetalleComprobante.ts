import { Expose } from 'class-transformer';

export class DetalleComprobante {
  @Expose({ name: 'iddetallecomprobante' })
  id: number;
  @Expose({ name: 'cantidad' })
  cantidad: number;
  @Expose({ name: 'costoindividual' })
  costoIndividual: number;
  @Expose({ name: 'subtotal' })
  subTotal: number;
  @Expose({ name: 'idcomprobante' })
  idcomprobante: number;
  @Expose({ name: 'idproducto' })
  idproducto: number;

  constructor(id?: number, cantidad?: number, costoIndividual?: number, subTotal?: number, idcomprobante?: number, producto?: number) {
    this.id = id!;
    this.cantidad = cantidad!;
    this.costoIndividual = costoIndividual!;
    this.subTotal = subTotal!;
    this.idcomprobante = idcomprobante!;
    this.idproducto = producto!;
  }
}
