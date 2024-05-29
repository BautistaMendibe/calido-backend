import { Expose, Transform } from 'class-transformer';

export enum TipoPregunta {
  ESTRELLA = 'estrella',
  CUADRADO = 'cuadrado',
  CIRCULO = 'circulo'
}

export class DetallePregunta {
  @Expose({ name: 'idOpcion' }) idOpcion: number;

  @Expose({ name: 'descripcionOpcion' }) descripcion: string;

  @Expose({ name: 'imagenOpcion' })
  @Transform((value: string) => (value === 'estrella' ? TipoPregunta.ESTRELLA : value === 'cuadrado' ? TipoPregunta.CUADRADO : TipoPregunta.CIRCULO))
  tipoPregunta: TipoPregunta;

  @Expose({ name: 'estaSeleccionado' }) @Transform((value: string) => value === 'S') seleccionado: boolean;

  constructor(idOpcion: number, descripcion: string, tipoPregunta: TipoPregunta, seleccionado: boolean) {
    this.idOpcion = idOpcion;
    this.descripcion = descripcion;
    this.tipoPregunta = tipoPregunta;
    this.seleccionado = seleccionado;
  }
}
