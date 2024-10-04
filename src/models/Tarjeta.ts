import { TipoTarjeta } from './TipoTarjeta';
import { Expose } from 'class-transformer';
import { CuotaPorTarjeta } from './CuotaPorTarjeta';

export class Tarjeta {
  @Expose({ name: 'idtarjeta' })
  id: number;
  @Expose({ name: 'ntarjeta' })
  nombre: string;
  @Expose({ name: 'idtipotarjeta' })
  idTipoTarjeta: number;

  tipoTarjeta: TipoTarjeta;
  cuotaPorTarjeta: CuotaPorTarjeta[];

  constructor(id?: number, nombre?: string, idTipoTarjeta?: number, tipoTarjeta?: TipoTarjeta, cuotaPorTarjeta?: CuotaPorTarjeta[]) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
    this.idTipoTarjeta = idTipoTarjeta ? idTipoTarjeta : null;
    this.tipoTarjeta = tipoTarjeta ? tipoTarjeta : null;
    this.cuotaPorTarjeta = cuotaPorTarjeta ? cuotaPorTarjeta : null;
  }
}
