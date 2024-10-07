import { Expose } from 'class-transformer';

export class TipoTarjeta {
  @Expose({ name: 'idtipotarjeta' })
  id: number;
  @Expose({ name: 'ntipotarjeta' })
  nombre: string;

  constructor(id?: number, nombre?: string) {
    this.id = id!;
    this.nombre = nombre!;
  }
}
