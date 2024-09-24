import { Expose } from 'class-transformer';

export class EstadoPedido {
  @Expose({ name: 'idestadopedido' })
  id: number;
  @Expose({ name: 'nestadopedido' })
  nombre: string;

  constructor(id?: number, nombre?: string) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
  }
}
