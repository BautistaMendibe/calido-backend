import { Expose } from 'class-transformer';

export class AccionDetalleConsulta {
  @Expose({ name: 'ESTADO_DESTINO' })
  estadoDestino: number;

  @Expose({ name: 'DESCRIPCION' })
  descripcion: string;

  constructor(estadoDestino?: number, descripcion?: string) {
    this.estadoDestino = estadoDestino;
    this.descripcion = descripcion;
  }
}
