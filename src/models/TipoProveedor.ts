import { Expose } from 'class-transformer';

export class TipoProveedor {
  @Expose({ name: 'idtipoproveedor' })
  id: number;
  @Expose({ name: 'ntipoproveedor' })
  nombre: string;

  constructor(id?: number, nombre?: string) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
  }
}
