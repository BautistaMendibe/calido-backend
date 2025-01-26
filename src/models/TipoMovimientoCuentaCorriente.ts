import { Expose } from 'class-transformer';

export class TipoMovimientoCuentaCorriente {
  @Expose({ name: 'idtipomovimientocuentacorriente' })
  id: number;

  @Expose({ name: 'ntipomovimientocuentacorriente' })
  nombre: string;

  constructor(id?: number, nombreTipo?: string) {
    this.id = id ? id : null;
    this.nombre = nombreTipo ? nombreTipo : null;
  }
}
