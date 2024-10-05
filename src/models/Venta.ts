import { Expose } from 'class-transformer';
import { Usuario } from './Usuario';
import { FormaDePago } from './FormaDePago';
import { DetalleVenta } from './DetalleVenta';
import { Producto } from './Producto';
import { TipoFactura } from './TipoFactura';

export class Venta {
  @Expose({ name: 'idventa' })
  id: number;
  @Expose({ name: 'montototal' })
  montoTotal: number;
  @Expose({ name: 'fechaventa' })
  fecha: Date;
  fechaString: string;
  fechaVencimiento: Date;
  @Expose({ name: 'idusuario' })
  usuario: Usuario;
  formaDePago: FormaDePago;
  productos: Producto[];
  facturacion: TipoFactura;

  constructor(
    id?: number,
    montoTotal?: number,
    fecha?: Date,
    usuario?: Usuario,
    formaDePago?: FormaDePago,
    fechaVencimiento?: Date,
    productos?: Producto[],
    facturacion?: TipoFactura,
    fechaString?: string
  ) {
    this.id = id!;
    this.montoTotal = montoTotal!;
    this.fecha = fecha!;
    this.usuario = usuario!;
    this.formaDePago = formaDePago!;
    this.productos = productos!;
    this.facturacion = facturacion!;
    this.fechaVencimiento = fechaVencimiento!;
    this.fechaString = fechaString!;
  }
}
