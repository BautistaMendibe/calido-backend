import { Expose } from 'class-transformer';
import { Venta } from './Venta';
import { Producto } from './Producto';

export class DetalleVenta {
  @Expose({ name: 'iddetalleventa' })
  id: number;
  @Expose({ name: 'cantidad' })
  cantidad: number;
  @Expose({ name: 'subtotalventa' })
  subTotal: number;

  venta: Venta;
  producto: Producto;

  constructor(id?: number, cantidad?: number, subTotal?: number, venta?: Venta, producto?: Producto) {
    this.id = id!;
    this.cantidad = cantidad!;
    this.subTotal = subTotal!;
    this.venta = venta!;
    this.producto = producto!;
  }
}
