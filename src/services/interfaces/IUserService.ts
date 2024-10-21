import { SpResult } from '../../models';
import { Usuario } from '../../models/Usuario';
import { FiltroEmpleados } from '../../models/comandos/FiltroEmpleados';
import { Asistencia } from '../../models/Asistencia';
import { FiltroAsistencias } from '../../models/comandos/FiltroAsistencias';
import { FiltroCuentasCorrientes } from '../../models/comandos/FiltroCuentasCorrientes';
import { CuentaCorriente } from '../../models/CuentaCorriente';
import { TipoProducto } from '../../models/TipoProducto';
import { Rol } from '../../models/Rol';
import { Motivo } from '../../models/Motivo';
import { Licencia } from '../../models/Licencia';
import { FiltrosLicencias } from '../../models/comandos/FiltroLicencias';
import { EstadoLicencia } from '../../models/EstadoLicencia';

export interface IUsersService {
  validarInicioSesion(nombreUsuario: string, contrasena: string): Promise<string>;
  registrarUsuario(usuario: Usuario): Promise<SpResult>;
  consultarEmpleados(filtro: FiltroEmpleados): Promise<Usuario[]>;
  consultarClientes(filtro: FiltroEmpleados): Promise<Usuario[]>;
  eliminarUsuario(idUsuario: number): Promise<SpResult>;
  modificarEmpleado(usuario: Usuario): Promise<SpResult>;
  registrarSuperusuario(usuario: Usuario): Promise<SpResult>;
  consultarAsistencias(filtro: FiltroAsistencias): Promise<Asistencia[]>;
  registrarAsistencia(asistencia: Asistencia): Promise<SpResult>;
  modificarAsistencia(asistencia: Asistencia): Promise<SpResult>;
  eliminarAsistencia(idAsistencia: number): Promise<SpResult>;
  obtenerRoles(): Promise<Rol[]>;
  obtenerRolesUsuario(idUsuario: number): Promise<Rol[]>;
  consultarCuentasCorrientesxUsuario(filtro: FiltroCuentasCorrientes): Promise<CuentaCorriente[]>;
  registrarCuentaCorriente(cuentaCorriente: CuentaCorriente): Promise<SpResult>;
  modificarCuentaCorriente(cuentaCorriente: CuentaCorriente): Promise<SpResult>;
  consultarAllUsuarios(): Promise<TipoProducto[]>;
  eliminarCuentaCorriente(idCuentaCorriente: number): Promise<SpResult>;
  obtenerMotivosLicencia(): Promise<Motivo[]>;
  registrarLicencia(licencia: Licencia): Promise<SpResult>;
  eliminarLicencia(idLicencia: number): Promise<SpResult>;
  consultarLicencias(filtro: FiltrosLicencias): Promise<Licencia[]>;
  obtenerEstadosLicencia(): Promise<EstadoLicencia[]>;
}
