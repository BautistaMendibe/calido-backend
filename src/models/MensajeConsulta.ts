import { Expose, Transform } from 'class-transformer';

export class MensajeConsulta {
  @Expose({ name: 'Id' })
  id: number;

  @Expose({ name: 'Fecha' })
  fecha: Date;

  @Expose({ name: 'Mensaje' })
  mensaje: string;

  @Expose({ name: 'NombreYApellido' })
  nombre: string;

  @Expose({ name: 'TipoEmpleado' })
  @Transform((value) => value?.trim())
  tipoUsuario: string;

  @Expose({ name: 'Avatar' })
  avatar: string;

  @Expose({ name: 'IdTipoUsuario' })
  idTipoUsuario: number;
}
