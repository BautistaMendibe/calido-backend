import { Expose } from 'class-transformer';

export class TipoFactura {
  @Expose({ name: 'idtipofacturacion' })
  id: number;
  @Expose({ name: 'ntipofacturacion' })
  nombre: string;

  constructor(id?: number, nombre?: string) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
  }
}
