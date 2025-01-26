import { Expose } from 'class-transformer';

export class TipoMovimientoArqueo {
  @Expose({ name: 'idtipomovimientoarqueo' })
  id: number;

  @Expose({ name: 'ntipomovimientoarqueo' })
  nombre: string;

  constructor(id?: number, nombreTipo?: string) {
    this.id = id ? id : null;
    this.nombre = nombreTipo ? nombreTipo : null;
  }
}
