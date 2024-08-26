import { Expose } from 'class-transformer';
import { Usuario } from './Usuario';
import { FormaDePago } from './FormaDePago';
import { DetalleVenta } from './DetalleVenta';
import { Producto } from './Producto';

export class Venta {
  @Expose({ name: 'idventa' })
  id: number;
  @Expose({ name: 'montototal' })
  montoTotal: number;
  @Expose({ name: 'fechaventa' })
  fecha: Date;
  @Expose({ name: 'idusuario' })
  usuario: Usuario;
  formaDePago: FormaDePago;
  productos: Producto[];

  constructor(id?: number, montoTotal?: number, fecha?: Date, usuario?: Usuario, formaDePago?: FormaDePago, detalleVenta?: DetalleVenta[], productos?: Producto[]) {
    this.id = id!;
    this.montoTotal = montoTotal!;
    this.fecha = fecha!;
    this.usuario = usuario!;
    this.formaDePago = formaDePago!;
    this.productos = productos!;
  }
}
