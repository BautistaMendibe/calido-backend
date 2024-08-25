import { Expose } from 'class-transformer';

export class FormaDePago {
  @Expose({ name: 'idformadepago' })
  id: number;
  @Expose({ name: 'nformadepago' })
  nombre: string;

  constructor(id?: number, nombre?: string) {
    this.id = id!;
    this.nombre = nombre!;
  }
}
