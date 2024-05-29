import { Expose } from 'class-transformer';

export class UnidadOperativaRecursosHumanos {
  @Expose({ name: 'ROWNUM' }) id: number;
  @Expose({ name: 'Id' }) codigo: string;
  @Expose({ name: 'Nombre' }) nombre: string;

  constructor(id?: number, codigo?: string, nombre?: string) {
    this.id = id;
    this.codigo = codigo;
    this.nombre = nombre;
  }
}
