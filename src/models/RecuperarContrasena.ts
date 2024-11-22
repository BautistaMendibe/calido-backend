export class RecuperarContrasena {
  correo: string;
  contrasena: string;
  token: string;

  constructor(correo?: string, contrasena?: string, token?: string) {
    this.correo = correo ? correo : null;
    this.contrasena = contrasena ? contrasena : null;
    this.token = token ? token : null;
  }
}
