import { Expose } from 'class-transformer';
import { Usuario } from './Usuario';

export class Asistencia {
  @Expose({ name: 'idasistencia' })
  id: number;
  @Expose({ name: 'idusuario' })
  idUsuario: number;
  @Expose({ name: 'fecha' })
  fecha: Date;
  @Expose({ name: 'hora_entrada' })
  horaEntrada: string;
  @Expose({ name: 'hora_salida' })
  horaSalida: string;
  @Expose({ name: 'comentario' })
  comentario: string;

  usuario: Usuario;

  constructor(id?: number, idUsuario?: number, fecha?: Date, horaEntrada?: string, horaSalida?: string, comentario?: string) {
    this.id = id!;
    this.idUsuario = idUsuario!;
    this.fecha = fecha!;
    this.horaEntrada = horaEntrada!;
    this.horaSalida = horaSalida!;
    this.comentario = comentario!;
  }
}
