import { Expose } from 'class-transformer';

export class CuotaPorTarjeta {
  @Expose({ name: 'idcuotaportarjeta' })
  id: number;
  @Expose({ name: 'interes' })
  interes: number;
  @Expose({ name: 'idcuota' })
  idCuota: number;
  @Expose({ name: 'idtarjeta' })
  idTarjeta: number;

  constructor(id?: number, interes?: number, idCuota?: number, idTarjeta?: number) {
    this.id = id ? id : null;
    this.interes = interes ? interes : null;
    this.idCuota = idCuota ? idCuota : null;
    this.idTarjeta = idTarjeta ? idTarjeta : null;
  }
}
