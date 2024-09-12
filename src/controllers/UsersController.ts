import { Request, Response } from 'express';
import { logger } from '../logger/CustomLogger';
import { HttpCodes, SpResult } from '../models';
import container from '../services/inversify.config';
import { TYPES } from '../services/types/types';
import { UsersService } from '../services/implementations/UsersService';
import { Usuario } from '../models/Usuario';
import { FiltroEmpleados } from '../models/comandos/FiltroEmpleados';
import { Asistencia } from '../models/Asistencia';
import { FiltroAsistencias } from '../models/comandos/FiltroAsistencias';
import { Rol } from '../models/Rol';

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

export const UsersController = {
  validarInicioSesion,
  registrarUsuario,
  consultarEmpleados,
  modificarEmpleado,
  eliminarUsuario,
  registrarSuperusuario,
  consultarAsistencias,
  registrarAsistencia,
  modificarAsistencia,
  eliminarAsistencia,
  obtenerRolesUsuario,
  obtenerRoles
};
