import { Request, Response } from 'express';
import { logger } from '../logger/CustomLogger';
import { HttpCodes, SpResult } from '../models';
import container from '../services/inversify.config';
import { TYPES } from '../services/types/types';
import { UsersService } from '../services/implementations';
import { Usuario } from '../models/Usuario';
import { FiltroEmpleados } from '../models/comandos/FiltroEmpleados';
import { Asistencia } from '../models/Asistencia';
import { FiltroAsistencias } from '../models/comandos/FiltroAsistencias';
import { Rol } from '../models/Rol';
import { FiltroCuentasCorrientes } from '../models/comandos/FiltroCuentasCorrientes';
import { CuentaCorriente } from '../models/CuentaCorriente';
import { Motivo } from '../models/Motivo';
import { Licencia } from '../models/Licencia';
import { FiltrosLicencias } from '../models/comandos/FiltroLicencias';
import { EstadoLicencia } from '../models/EstadoLicencia';
import { RecuperarContrasena } from '../models/RecuperarContrasena';
import { UltimosMovimientos } from '../models/comandos/UltimosMovimientos';
import { FiltrosMovimientosCuentaCorriente } from '../models/comandos/FiltroMovimientoCuentaCorriente';
import { MovimientoCuentaCorriente } from '../models/MovimientoCuentaCorriente';

const _usersService = container.get<UsersService>(TYPES.UsersService);

export async function validarInicioSesion(request: Request, response: Response): Promise<Response> {
  const nombreUsuario: string = request.body.usuario;
  const contrasena: string = request.body.contrasena;

  return _usersService
    .validarInicioSesion(nombreUsuario, contrasena)
    .then((x: string) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function registrarUsuario(request: Request, response: Response): Promise<Response> {
  const usuario: Usuario = request.body;

  return _usersService
    .registrarUsuario(usuario)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function registrarSuperusuario(request: Request, response: Response): Promise<Response> {
  const usuario: Usuario = request.body;

  return _usersService
    .registrarSuperusuario(usuario)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function consultarEmpleados(request: Request, response: Response): Promise<Response> {
  const filtro: FiltroEmpleados = request.body;

  return _usersService
    .consultarEmpleados(filtro)
    .then((x: Usuario[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function consultarClientes(request: Request, response: Response): Promise<Response> {
  const filtro: FiltroEmpleados = request.body;

  return _usersService
    .consultarClientes(filtro)
    .then((x: Usuario[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function consultarAsistencias(request: Request, response: Response): Promise<Response> {
  const filtro: FiltroAsistencias = request.body;

  return _usersService
    .consultarAsistencias(filtro)
    .then((x: Asistencia[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function registrarAsistencia(request: Request, response: Response): Promise<Response> {
  const asistencia: Asistencia = request.body;

  return _usersService
    .registrarAsistencia(asistencia)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function modificarEmpleado(request: Request, response: Response): Promise<Response> {
  const usuario: Usuario = request.body;

  return _usersService
    .modificarEmpleado(usuario)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function modificarAsistencia(request: Request, response: Response): Promise<Response> {
  const asistencia: Asistencia = request.body;

  return _usersService
    .modificarAsistencia(asistencia)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function eliminarUsuario(request: Request, response: Response): Promise<Response> {
  const idUsuario: number = +request.params.id;

  return _usersService
    .eliminarUsuario(idUsuario)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function eliminarAsistencia(request: Request, response: Response): Promise<Response> {
  const idAsistencia: number = +request.params.id;

  return _usersService
    .eliminarAsistencia(idAsistencia)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function consultarCuentasCorrientesxUsuario(request: Request, response: Response): Promise<Response> {
  const filtro: FiltroCuentasCorrientes = request.body;

  return _usersService
    .consultarCuentasCorrientesxUsuario(filtro)
    .then((x: CuentaCorriente[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function consultarAllUsuarios(request: Request, response: Response): Promise<Response> {
  return _usersService
    .consultarAllUsuarios()
    .then((x: Usuario[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function registrarCuentaCorriente(request: Request, response: Response): Promise<Response> {
  const cuentaCorriente: CuentaCorriente = request.body;

  return _usersService
    .registrarCuentaCorriente(cuentaCorriente)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function modificarCuentaCorriente(request: Request, response: Response): Promise<Response> {
  const cuentaCorriente: CuentaCorriente = request.body;

  return _usersService
    .modificarCuentaCorriente(cuentaCorriente)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function eliminarCuentaCorriente(request: Request, response: Response): Promise<Response> {
  const idCuentaCorriente: number = +request.params.id;

  return _usersService
    .eliminarCuentaCorriente(idCuentaCorriente)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function obtenerRolesUsuario(request: Request, response: Response): Promise<Response> {
  const idUsuario: number = +request.params.id;

  return _usersService
    .obtenerRolesUsuario(idUsuario)
    .then((x: Rol[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function obtenerRoles(request: Request, response: Response): Promise<Response> {
  return _usersService
    .obtenerRoles()
    .then((x: Rol[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function obtenerMotivosLicencia(request: Request, response: Response): Promise<Response> {
  return _usersService
    .obtenerMotivosLicencia()
    .then((x: Motivo[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function registrarLicencia(request: Request, response: Response): Promise<Response> {
  const licencia: Licencia = request.body;

  return _usersService
    .registrarLicencia(licencia)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function eliminarLicencia(request: Request, response: Response): Promise<Response> {
  const idLicencia: number = +request.params.id;

  return _usersService
    .eliminarLicencia(idLicencia)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function consultarLicencias(request: Request, response: Response): Promise<Response> {
  const filtro: FiltrosLicencias = request.body;

  return _usersService
    .consultarLicencias(filtro)
    .then((x: Licencia[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function obtenerEstadosLicencia(request: Request, response: Response): Promise<Response> {
  return _usersService
    .obtenerEstadosLicencia()
    .then((x: EstadoLicencia[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function modificarLicencia(request: Request, response: Response): Promise<Response> {
  const licencia: Licencia = request.body;

  return _usersService
    .modificarLicencia(licencia)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function recuperarContrasena(request: Request, response: Response): Promise<Response> {
  const recuperarContrasena: RecuperarContrasena = request.body;

  return _usersService
    .recuperarContrasena(recuperarContrasena)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function cambiarContrasena(request: Request, response: Response): Promise<Response> {
  const recuperarContrasena: RecuperarContrasena = request.body;

  return _usersService
    .cambiarContrasena(recuperarContrasena)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function buscarUltimosClientes(request: Request, response: Response): Promise<Response> {
  return _usersService
    .buscarUltimosClientes()
    .then((x: Usuario[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function buscarUltimosLogs(request: Request, response: Response): Promise<Response> {
  return _usersService
    .buscarUltimosLogs()
    .then((x: UltimosMovimientos[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function consultarMovimientosCuentaCorriente(request: Request, response: Response): Promise<Response> {
  const filtro: FiltrosMovimientosCuentaCorriente = request.body;

  return _usersService
    .consultarMovimientosCuentaCorriente(filtro)
    .then((x: MovimientoCuentaCorriente[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function eliminarMovimientoCuentaCorriente(request: Request, response: Response): Promise<Response> {
  const idMovimiento: number = +request.params.id;

  return _usersService
    .eliminarMovimientoCuentaCorriente(idMovimiento)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function registrarMovimientoCuentaCorriente(request: Request, response: Response): Promise<Response> {
  const movimiento: MovimientoCuentaCorriente = request.body;

  return _usersService
    .registrarMovimientoCuentaCorriente(movimiento)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export const UsersController = {
  validarInicioSesion,
  registrarUsuario,
  consultarEmpleados,
  consultarClientes,
  modificarEmpleado,
  eliminarUsuario,
  registrarSuperusuario,
  consultarAsistencias,
  registrarAsistencia,
  modificarAsistencia,
  eliminarAsistencia,
  consultarCuentasCorrientesxUsuario,
  registrarCuentaCorriente,
  consultarAllUsuarios,
  eliminarCuentaCorriente,
  modificarCuentaCorriente,
  obtenerRolesUsuario,
  obtenerRoles,
  obtenerMotivosLicencia,
  registrarLicencia,
  eliminarLicencia,
  consultarLicencias,
  obtenerEstadosLicencia,
  modificarLicencia,
  recuperarContrasena,
  cambiarContrasena,
  buscarUltimosClientes,
  buscarUltimosLogs,
  consultarMovimientosCuentaCorriente,
  eliminarMovimientoCuentaCorriente,
  registrarMovimientoCuentaCorriente
};
