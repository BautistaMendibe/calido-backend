import { Expose } from 'class-transformer';

export class UbicacionReclamo {
  @Expose({ name: 'Area' })
  area: string;
  @Expose({ name: 'Oficina' })
  oficina: string;

  constructor(area?: string, oficina?: string) {
    this.area = area;
    this.oficina = oficina;
  }
}
