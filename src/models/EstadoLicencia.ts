import { Expose } from 'class-transformer';

export class EstadoLicencia {
  @Expose({ name: 'idestadolicencia' })
  id: number;
  @Expose({ name: 'nestadolicencia' })
  nombre: string;

  constructor(id?: number, nombre?: string) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
  }
}
