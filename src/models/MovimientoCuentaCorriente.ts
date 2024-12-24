import { Expose } from 'class-transformer';
import { CuentaCorriente } from './CuentaCorriente';
import { FormaDePago } from './FormaDePago';

export class MovimientoCuentaCorriente {
  @Expose({ name: 'idmovimientoscuentacorriente' })
  id: number;
  @Expose({ name: 'idcuentacorriente' })
  idCuentaCorriente: number;
  @Expose({ name: 'idventa' })
  idVenta: number;
  @Expose({ name: 'fechamovimiento' })
  fecha: Date;
  @Expose({ name: 'monto' })
  monto: number;
  @Expose({ name: 'idformadepago' })
  idFormaDePago: number;
  @Expose({ name: 'descripcion' })
  descripcion: string;

  cuentaCorriente: CuentaCorriente;
  formaDePago: FormaDePago;

  constructor(
    id?: number,
    idCuentaCorriente?: number,
    idVenta?: number,
    fecha?: Date,
    monto?: number,
    idFormaDePago?: number,
    cuentaCorriente?: CuentaCorriente,
    formaDePago?: FormaDePago,
    descripcion?: string
  ) {
    this.id = id ? id : null;
    this.idCuentaCorriente = idCuentaCorriente;
    this.idVenta = idVenta;
    this.fecha = fecha!;
    this.monto = monto!;
    this.idFormaDePago = idFormaDePago!;
    this.cuentaCorriente = cuentaCorriente!;
    this.formaDePago = formaDePago!;
    this.descripcion = descripcion!;
  }
}
