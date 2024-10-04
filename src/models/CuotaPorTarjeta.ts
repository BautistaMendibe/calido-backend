import { Expose } from 'class-transformer';
import { Cuota } from './Cuota';

export class CuotaPorTarjeta {
  @Expose({ name: 'idcuotaportarjeta' })
  id: number;
  @Expose({ name: 'interes' })
  interes: number;
  @Expose({ name: 'idcuota' })
  idCuota: number;
  @Expose({ name: 'idtarjeta' })
  idTarjeta: number;

  cuota: Cuota;

  constructor(id?: number, interes?: number, idCuota?: number, idTarjeta?: number, cuota?: Cuota) {
    this.id = id ? id : null;
    this.interes = interes ? interes : null;
    this.idCuota = idCuota ? idCuota : null;
    this.idTarjeta = idTarjeta ? idTarjeta : null;
    this.cuota = cuota ? cuota : null;
  }
}
