import { SpResult } from '../../models';

export interface IUsersService {
  validarInicioSesion(nombreUsuario: string, contrasena: string): Promise<SpResult>;
}
