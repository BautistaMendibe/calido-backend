import { Expose } from 'class-transformer';
import { Usuario } from './Usuario';
import { EstadoLicencia } from './EstadoLicencia';
import { Motivo } from './Motivo';

export class Licencia {
  @Expose({ name: 'idlicencia' })
  id: number;
  @Expose({ name: 'idusuario' })
  idUsuario: string;
  @Expose({ name: 'fecha_inicio' })
  fechaInicio: Date;
  @Expose({ name: 'fecha_fin' })
  fechaFin: Date;
  @Expose({ name: 'idmotivolicencia' })
  idMotivoLicencia: number;
  @Expose({ name: 'idestadolicencia' })
  idEstadoLicencia: number;
  @Expose({ name: 'comentario' })
  comentario: string;

  usuario: Usuario;
  estadoLicencia: EstadoLicencia;
  motivo: Motivo;

  constructor(
    id?: number,
    idUsuario?: string,
    fechaInicio?: Date,
    fechaFin?: Date,
    idMotivoLicencia?: number,
    idEstadoLicencia?: number,
    comentario?: string,
    usuario?: Usuario,
    estadoLicencia?: EstadoLicencia,
    motivo?: Motivo
  ) {
    this.id = id ? id : null;
    this.idUsuario = idUsuario ? idUsuario : null;
    this.fechaInicio = fechaInicio ? fechaInicio : null;
    this.fechaFin = fechaFin ? fechaFin : null;
    this.idMotivoLicencia = idMotivoLicencia ? idMotivoLicencia : null;
    this.idEstadoLicencia = idEstadoLicencia ? idEstadoLicencia : null;
    this.comentario = comentario ? comentario : null;
    this.usuario = usuario ? usuario : null;
    this.estadoLicencia = estadoLicencia ? estadoLicencia : null;
    this.motivo = motivo ? motivo : null;
  }
}
