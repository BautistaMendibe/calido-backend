import { Expose } from 'class-transformer';

export class FormaDePago {
  @Expose({ name: 'idformadepago' })
  id: number;
  @Expose({ name: 'nformadepago' })
  nombre: string;
  @Expose({ name: 'idafip' })
  idAfip: number;

  constructor(id?: number, nombre?: string, idAfip?: number) {
    this.id = id!;
    this.nombre = nombre!;
    this.idAfip = idAfip!;
  }
}
