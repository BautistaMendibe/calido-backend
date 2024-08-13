import { SpResult } from '../../models';
import { Usuario } from '../../models/Usuario';
import { FiltroEmpleados } from '../../models/comandos/FiltroEmpleados';

export interface IUsersService {
  validarInicioSesion(nombreUsuario: string, contrasena: string): Promise<string>;
  registrarUsuario(usuario: Usuario): Promise<SpResult>;
  consultarEmpleados(filtro: FiltroEmpleados): Promise<Usuario[]>;
  eliminarUsuario(idUsuario: number): Promise<SpResult>;
  modificarEmpleado(usuario: Usuario): Promise<SpResult>;
  registrarSuperusuario(usuario: Usuario): Promise<SpResult>;
}
