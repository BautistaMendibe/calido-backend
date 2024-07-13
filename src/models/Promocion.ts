import { Expose } from 'class-transformer';

export class Promocion {
  @Expose({ name: 'idpromocionproducto' })
  id: number;
  @Expose({ name: 'npromocionproducto' })
  nombre: string;
  @Expose({ name: 'percentdescuento' })
  porcentajeDescuento: string;
  @Expose({ name: 'idproducto' })
  idProducto: number;

  constructor(id?: number, nombre?: string, porcentajeDescuento?: string, idProducto?: number) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
    this.porcentajeDescuento = porcentajeDescuento ? porcentajeDescuento : null;
    this.idProducto = idProducto ? idProducto : null;
  }
}
