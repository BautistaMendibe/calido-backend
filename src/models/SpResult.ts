import { Expose } from 'class-transformer';

export class SpResult {
  @Expose({ name: 'id' })
  id: number;
  @Expose({ name: 'mensaje' })
  mensaje: string;
  @Expose({ name: 'Error' })
  error: string;
  @Expose({ name: 'IdReclamo' })
  idConsulta: number;

  constructor(id?: number, mensaje?: string, error?: string, idConsulta?: number) {
    this.id = id ? id : null;
    this.mensaje = mensaje ? mensaje : null;
    this.error = error ? error : null;
    this.idConsulta = idConsulta;
  }
}
