import { Expose } from 'class-transformer';

export class Rol {
  @Expose({ name: 'idrol' })
  id: number;
  @Expose({ name: 'nrol' })
  nombre: string;

  constructor(id?: number, nombre?: string) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
  }
}
