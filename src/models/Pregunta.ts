import { Expose, Transform } from 'class-transformer';
import { DetallePregunta } from './DetallePregunta';

export class Pregunta {
  @Expose({ name: 'idPregunta' }) idPregunta: number;

  @Expose({ name: 'descripcionPregunta' }) descripcion: string;

  @Expose({ name: 'tieneComentario' }) @Transform((value: string) => value === 'S') tieneComentario: boolean;

  @Expose({ name: 'estaRespondida' }) @Transform((value: string) => value === 'S') estaRespondida: boolean;
  detallesPregunta: DetallePregunta[];

  @Expose({ name: 'comentario' }) @Transform((value: string) => value.trim()) comentario: string;

  constructor(idPregunta: number, descripcion: string, tieneComentario: boolean, comentario: string, estaRespondida: boolean, detallesPregunta: DetallePregunta[]) {
    this.idPregunta = idPregunta;
    this.descripcion = descripcion;
    this.tieneComentario = tieneComentario;
    this.comentario = comentario;
    this.estaRespondida = estaRespondida;
    this.detallesPregunta = detallesPregunta;
  }
}
