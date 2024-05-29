import { Expose } from 'class-transformer';

export class EstadoConsulta {
  @Expose({ name: 'Estado' })
  nombre: string;
  @Expose({ name: 'Descripcion' })
  descripcion: string;
  @Expose({ name: 'Fecha' })
  fechaHora: Date;

  constructor(estado?: string, descripcion?: string, fechaHora?: Date) {
    this.nombre = estado;
    this.descripcion = descripcion;
    this.fechaHora = fechaHora;
  }
}
