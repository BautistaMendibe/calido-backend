import { SpResult } from '../../models';
import { Usuario } from '../../models/Usuario';

export interface IUsersService {
  validarInicioSesion(nombreUsuario: string, contrasena: string): Promise<Usuario>;
}
