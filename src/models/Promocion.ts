import { Expose } from 'class-transformer';
import { Producto } from './Producto';

export class Promocion {
  @Expose({ name: 'idpromocionproducto' })
  id: number;
  @Expose({ name: 'npromocionproducto' })
  nombre: string;
  @Expose({ name: 'percentdescuento' })
  porcentajeDescuento: string;
  @Expose({ name: 'idproducto' })
  idProducto: number;

  producto: Producto;

  constructor(id?: number, nombre?: string, porcentajeDescuento?: string, idProducto?: number, producto?: Producto) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
    this.porcentajeDescuento = porcentajeDescuento ? porcentajeDescuento : null;
    this.idProducto = idProducto ? idProducto : null;
    this.producto = producto ? producto : null;
  }
}
