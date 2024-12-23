import { Expose } from 'class-transformer';
import { CuentaCorriente } from './CuentaCorriente';

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
  @Expose({ name: 'descripcion' })
  descripcion: string;

  cuentaCorriente: CuentaCorriente;

  constructor(id?: number, idCuentaCorriente?: number, idVenta?: number, fecha?: Date, monto?: number, descripcion?: string, cuentaCorriente?: CuentaCorriente) {
    this.id = id ? id : null;
    this.idCuentaCorriente = idCuentaCorriente;
    this.idVenta = idVenta;
    this.fecha = fecha!;
    this.monto = monto!;
    this.descripcion = descripcion!;
    this.cuentaCorriente = cuentaCorriente!;
  }
}
