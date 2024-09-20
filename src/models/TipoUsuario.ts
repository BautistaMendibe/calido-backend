import { Expose } from 'class-transformer';

export class TipoUsuario {
  @Expose({ name: 'idtipousuario' })
  id: number;
  @Expose({ name: 'ntipousuario' })
  nombre: string;

  constructor(id?: number, nombre?: string) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
  }
}
