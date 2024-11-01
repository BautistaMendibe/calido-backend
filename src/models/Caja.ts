import { Expose } from 'class-transformer';

export class Caja {
  @Expose({ name: 'idcaja' })
  id: number;
  @Expose({ name: 'ncaja' })
  nombre: string;
  @Expose({ name: 'descripcion' })
  descripcion: string;

  constructor(id?: number, nombre?: string, descripcion?: string) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
    this.descripcion = descripcion ? descripcion : null;
  }
}
