import { Expose } from 'class-transformer';

export class TipoProducto {
  @Expose({ name: 'idtipoproducto' })
  id: number;

  @Expose({ name: 'ntipoproducto' })
  nombre: string;

  constructor(id?: number, nombreTipo?: string) {
    this.id = id ? id : null;
    this.nombre = nombreTipo ? nombreTipo : null;
  }
}
