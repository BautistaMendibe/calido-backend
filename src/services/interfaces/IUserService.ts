import { SpResult } from '../../models';
import { Usuario } from '../../models/Usuario';

export interface IUsersService {
  validarInicioSesion(nombreUsuario: string, contrasena: string): Promise<string>;
  registrarUsuario(usuario: Usuario): Promise<SpResult>;
}
