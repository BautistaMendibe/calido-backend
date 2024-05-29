export class RespuestaCustom {
  error: boolean;
  mensaje: string;

  constructor(error?: boolean, mensaje?: string) {
    this.error = error;
    this.mensaje = mensaje;
  }
}
