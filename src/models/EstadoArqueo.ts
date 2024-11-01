import { Expose } from 'class-transformer';

export class EstadoArqueo {
  @Expose({ name: 'idestadoarqueo' })
  id: number;
  @Expose({ name: 'nestadoarqueo' })
  nombre: string;

  constructor(id?: number, nombre?: string) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
  }
}
