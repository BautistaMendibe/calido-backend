import { Expose } from 'class-transformer';
import { CuentaCorriente } from './CuentaCorriente';
import { FormaDePago } from './FormaDePago';
import { TipoMovimientoCuentaCorriente } from './TipoMovimientoCuentaCorriente';
import { Usuario } from './Usuario';

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
  @Expose({ name: 'idtipomovimientocuentacorriente' })
  idTipoMovimientoCuentaCorriente: number;
  @Expose({ name: 'comprobante' })
  comprobante: string;
  @Expose({ name: 'anulado' })
  anulado: number;
  @Expose({ name: 'devuelto' })
  devuelto: number;
  @Expose({ name: 'idcaja' })
  idCaja: number;
  @Expose({ name: 'idusuario' })
  idUsuario: number;

  cuentaCorriente: CuentaCorriente;
  formaDePago: FormaDePago;
  tipoMovimientoCuentaCorriente: TipoMovimientoCuentaCorriente;

  constructor(
    id?: number,
    idCuentaCorriente?: number,
    idVenta?: number,
    fecha?: Date,
    monto?: number,
    idFormaDePago?: number,
    cuentaCorriente?: CuentaCorriente,
    formaDePago?: FormaDePago,
    idTipoMovimientoCuentaCorriente?: number,
    tipoMovimientoCuentaCorriente?: TipoMovimientoCuentaCorriente,
    comprobante?: string,
    anulado?: number,
    devuelto?: number,
    idCaja?: number,
    idUsuario?: number
  ) {
    this.id = id ? id : null;
    this.idCuentaCorriente = idCuentaCorriente;
    this.idVenta = idVenta;
    this.fecha = fecha!;
    this.monto = monto!;
    this.idFormaDePago = idFormaDePago!;
    this.cuentaCorriente = cuentaCorriente!;
    this.formaDePago = formaDePago!;
    this.idTipoMovimientoCuentaCorriente = idTipoMovimientoCuentaCorriente!;
    this.tipoMovimientoCuentaCorriente = tipoMovimientoCuentaCorriente!;
    this.comprobante = comprobante!;
    this.anulado = anulado!;
    this.devuelto = devuelto!;
    this.idCaja = idCaja!;
    this.idUsuario = idUsuario!;
  }
}
