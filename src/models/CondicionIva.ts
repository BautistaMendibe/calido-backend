import { Expose } from 'class-transformer';

export class CondicionIva {
  @Expose({ name: 'idcondicioniva' })
  id: number;
  @Expose({ name: 'ncondicioniva' })
  nombre: string;

  constructor(id?: number, nombre?: string) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
  }
}
