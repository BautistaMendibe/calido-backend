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
  @Expose({ name: 'recargo' })
  recargo: number;
  @Expose({ name: 'descuento' })
  descuento: number;

  cuota: Cuota;

  constructor(id?: number, interes?: number, idCuota?: number, idTarjeta?: number, cuota?: Cuota, recargo?: number, descuento?: number) {
    this.id = id ? id : null;
    this.interes = interes ? interes : null;
    this.idCuota = idCuota ? idCuota : null;
    this.idTarjeta = idTarjeta ? idTarjeta : null;
    this.cuota = cuota ? cuota : null;
    this.recargo = recargo ? recargo : null;
    this.descuento = descuento ? descuento : null;
  }
}
