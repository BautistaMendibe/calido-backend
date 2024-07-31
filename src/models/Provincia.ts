import { Expose } from 'class-transformer';

export class Provincia {
  @Expose({ name: 'idprovincia' })
  id: number;
  @Expose({ name: 'nprovincia' })
  nombre: string;

  constructor(id?: number, nombre?: string) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
  }
}
