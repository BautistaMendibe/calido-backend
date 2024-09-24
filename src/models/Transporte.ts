import { Expose } from 'class-transformer';

export class Transporte {
  @Expose({ name: 'idtransporte' })
  id: number;

  @Expose({ name: 'ntransporte' })
  nombre: string;

  constructor(id?: number, nombre?: string) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
  }
}
