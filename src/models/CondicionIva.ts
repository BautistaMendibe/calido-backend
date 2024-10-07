import { Expose } from 'class-transformer';

export class CondicionIva {
  @Expose({ name: 'idcondicioniva' })
  id: number;
  @Expose({ name: 'ncondicioniva' })
  nombre: string;
  @Expose({ name: 'abreviatura' })
  abreviatura: string;

  constructor(id?: number, nombre?: string, abreviatura?: string) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
    this.abreviatura = abreviatura ? abreviatura : null;
  }
}
