import { Expose } from 'class-transformer';

export class Archivo {
  @Expose({ name: 'idarchivo' })
  id: number;
  @Expose({ name: 'narchivo' })
  nombre: string;
  @Expose({ name: 'ruta' })
  ruta: string;
  @Expose({ name: 'fechaSubida' })
  fechaSubida: Date;
  @Expose({ name: 'tipo' })
  tipo: string;
  @Expose({ name: 'tamano' })
  tamano: number;

  constructor(id?: number, nombre?: string, ruta?: string, fechaSubida?: Date) {
    this.id = id!;
    this.nombre = nombre!;
    this.ruta = ruta!;
    this.fechaSubida = fechaSubida!;
  }
}
