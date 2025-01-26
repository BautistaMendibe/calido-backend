import { Expose } from 'class-transformer';
import { FormaDePago } from './FormaDePago';
import { TipoMovimientoArqueo } from './TipoMovimientoArqueo';

export class MovimientoManual {
  @Expose({ name: 'idmovimientosarqueo' })
  id: number;
  @Expose({ name: 'idarqueo' })
  idArqueo: number;
  @Expose({ name: 'fechamovimiento' })
  fechaMovimiento: Date;
  formaPago: FormaDePago;
  @Expose({ name: 'descripcion' })
  descripcion: string;
  @Expose({ name: 'tipomovimiento' })
  tipoMovimiento: string;
  @Expose({ name: 'monto' })
  monto: number;
  @Expose({ name: 'idtipomovimientoarqueo' })
  idTipoMovimientoArqueo: number;

  tipoMovimientoArqueo: TipoMovimientoArqueo;

  constructor(
    id?: number,
    idArqueo?: number,
    fechaMovimiento?: Date,
    formaPago?: FormaDePago,
    descripcion?: string,
    tipoMovimiento?: string,
    monto?: number,
    idTipoMovimientoArqueo?: number,
    tipoMovimientoArqueo?: TipoMovimientoArqueo
  ) {
    this.id = id ? id : null;
    this.idArqueo = idArqueo ? idArqueo : null;
    this.fechaMovimiento = fechaMovimiento ? fechaMovimiento : null;
    this.formaPago = formaPago ? formaPago : null;
    this.descripcion = descripcion ? descripcion : null;
    this.tipoMovimiento = tipoMovimiento ? tipoMovimiento : null;
    this.monto = monto ? monto : null;
    this.idTipoMovimientoArqueo = idTipoMovimientoArqueo ? idTipoMovimientoArqueo : null;
    this.tipoMovimientoArqueo = tipoMovimientoArqueo ? tipoMovimientoArqueo : null;
  }
}
