import { Expose } from 'class-transformer';
import { Producto } from './Producto';

export class MovimientoProducto {
  @Expose({ name: 'idmovimientosproducto' })
  id: number;
  @Expose({ name: 'idproducto' })
  idProducto: number;
  @Expose({ name: 'fecha' })
  fecha: Date;
  @Expose({ name: 'tipo_movimiento' })
  tipoMovimiento: string;
  @Expose({ name: 'cantidad' })
  cantidad: number;
  @Expose({ name: 'referencia' })
  referencia: string;

  producto: Producto;

  constructor(id?: number, idProducto?: number, fecha?: Date, tipoMovimiento?: string, cantidad?: number, referencia?: string, producto?: Producto) {
    this.id = id ? id : null;
    this.idProducto = idProducto ? idProducto : null;
    this.fecha = fecha ? fecha : null;
    this.tipoMovimiento = tipoMovimiento ? tipoMovimiento : null;
    this.cantidad = cantidad ? cantidad : null;
    this.referencia = referencia ? referencia : null;
    this.producto = producto ? producto : null;
  }
}
