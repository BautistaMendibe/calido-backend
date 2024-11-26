import { Expose } from 'class-transformer';

export class UltimosMovimientos {
  @Expose({ name: 'id' })
  id: number;
  @Expose({ name: 'nombre' })
  nombre: string;
  @Expose({ name: 'codigo' })
  codigo: number;
  @Expose({ name: 'costo' })
  costo: number;
  @Expose({ name: 'fecha' })
  fecha: Date;
  @Expose({ name: 'icono' })
  icono: string;
  @Expose({ name: 'usuario' })
  usuario: string;

  constructor(nombre?: string, id?: number, codigo?: number, costo?: number, fecha?: Date, icono?: string, usuario?: string) {
    this.nombre = nombre!;
    this.id = id!;
    this.codigo = codigo!;
    this.costo = costo!;
    this.fecha = fecha!;
    this.icono = icono!;
    this.usuario = usuario!;
  }
}
