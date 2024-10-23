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
  @Expose({ name: 'descuento' })
  descuento: number;
  @Expose({ name: 'cantcuotas' })
  cantidadCuota: number;

  constructor(id?: number, interes?: number, idCuota?: number, idTarjeta?: number, descuento?: number, cantidadCuota?: number) {
    this.id = id ? id : null;
    this.interes = interes ? interes : null;
    this.idCuota = idCuota ? idCuota : null;
    this.idTarjeta = idTarjeta ? idTarjeta : null;
    this.descuento = descuento ? descuento : null;
    this.cantidadCuota = cantidadCuota ? cantidadCuota : null;
  }
}
