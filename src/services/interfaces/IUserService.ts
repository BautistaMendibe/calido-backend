import { SpResult } from '../../models';
import { Usuario } from '../../models/Usuario';
import { FiltroEmpleados } from '../../models/comandos/FiltroEmpleados';
import { Asistencia } from '../../models/Asistencia';
import { FiltroAsistencias } from '../../models/comandos/FiltroAsistencias';
import { FiltroCuentasCorrientes } from '../../models/comandos/FiltroCuentasCorrientes';
import { CuentaCorriente } from '../../models/CuentaCorriente';
import { Request, Response } from 'express';
import { TipoProducto } from '../../models/TipoProducto';

export interface IUsersService {
  validarInicioSesion(nombreUsuario: string, contrasena: string): Promise<string>;
  registrarUsuario(usuario: Usuario): Promise<SpResult>;
  consultarEmpleados(filtro: FiltroEmpleados): Promise<Usuario[]>;
  eliminarUsuario(idUsuario: number): Promise<SpResult>;
  modificarEmpleado(usuario: Usuario): Promise<SpResult>;
  registrarSuperusuario(usuario: Usuario): Promise<SpResult>;
  consultarAsistencias(filtro: FiltroAsistencias): Promise<Asistencia[]>;
  registrarAsistencia(asistencia: Asistencia): Promise<SpResult>;
  modificarAsistencia(asistencia: Asistencia): Promise<SpResult>;
  eliminarAsistencia(idAsistencia: number): Promise<SpResult>;
  //cuenta corriente
  consultarCuentasCorrientesxUsuario(filtro: FiltroCuentasCorrientes): Promise<CuentaCorriente[]>;
  registrarCuentaCorriente(cuentaCorriente: CuentaCorriente): Promise<SpResult>;
  modificarCuentaCorriente(cuentaCorriente: CuentaCorriente): Promise<SpResult>;
  consultarAllUsuarios(): Promise<TipoProducto[]>;
  eliminarCuentaCorriente(idCuentaCorriente: number): Promise<SpResult>;
}
