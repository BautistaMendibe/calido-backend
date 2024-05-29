import { Expose } from 'class-transformer';

export class AreaRecursosHumanos {
  @Expose({ name: 'Id' }) id: string;
  @Expose({ name: 'Nombre' }) nombre: string;

  constructor(id?: string, nombre?: string) {
    this.id = id;
    this.nombre = nombre;
  }
}
