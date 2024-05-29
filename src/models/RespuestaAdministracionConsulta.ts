import { Expose, Transform } from 'class-transformer';

export class RespuestaAdministracionConsulta {
  @Expose({ name: 'Id' })
  id: number;
  @Expose({ name: 'Solicitud' })
  solicitud: string;
  @Expose({ name: 'Cuil' })
  cuil: string;
  @Expose({ name: 'Nombre' })
  nombre: string;
  @Expose({ name: 'Apellido' })
  apellido: string;
  @Expose({ name: 'Asunto' })
  asunto: string;
  @Expose({ name: 'Estado' })
  estado: string;
  @Expose({ name: 'IdEstado' })
  idEstado: string;
  @Expose({ name: 'FechaAlta' })
  fechaAlta: Date;
  @Expose({ name: 'Dias' })
  dias: number;
  @Expose({ name: 'Usuario' })
  usuario: string;
  @Expose({ name: 'FechaUltimoDetalle' })
  fechaUltimoDetalle: string;
  @Expose({ name: 'FECHAMAYOR' })
  fechaMayor: string;
  @Expose({ name: 'TieneMarca' })
  @Transform((value) => value === 'S')
  tieneMarca: boolean;
  @Expose({ name: 'CodArea' })
  codigoArea: string;
  @Expose({ name: 'CodOficina' })
  codigoOficina: string;
}
