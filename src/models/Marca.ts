import { Expose } from 'class-transformer';

export class Marca {
  @Expose({ name: 'idmarca' })
  id: number;

  @Expose({ name: 'nmarca' })
  nombre: string;

  constructor(id?: number, nombre?: string) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
  }
}
