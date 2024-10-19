import { Expose } from 'class-transformer';

export class Motivo {
  @Expose({ name: 'idmotivolicencia' })
  id: number;

  @Expose({ name: 'nmotivolicencia' })
  nombre: string;

  constructor(id?: number, nombreTipo?: string) {
    this.id = id ? id : null;
    this.nombre = nombreTipo ? nombreTipo : null;
  }
}
