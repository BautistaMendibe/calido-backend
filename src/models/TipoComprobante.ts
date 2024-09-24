import { Expose } from 'class-transformer';

export class TipoComprobante {
  @Expose({ name: 'idtipocomprobante' })
  id: number;
  @Expose({ name: 'ntipocomprobante' })
  nombre: string;

  constructor(id?: number, nombre?: string) {
    this.id = id!;
    this.nombre = nombre!;
  }
}
