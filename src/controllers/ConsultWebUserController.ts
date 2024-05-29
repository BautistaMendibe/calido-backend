import { Request, Response } from 'express';
import { logger } from '../logger/CustomLogger';
import { ArchivoGenerico, ComboResultado, ConsultaUsuarioWeb, HttpCodes, SpResult } from '../models';
import { Beneficio } from '../models/Beneficio';
import { EstadoConsulta } from '../models/EstadoConsulta';
import { UbicacionReclamo } from '../models/UbicacionReclamo';
import { ValidacionAdjuntarDocumento } from '../models/ValidacionAdjuntarDocumento';
import { ConsultWebUserService, UtilsService } from '../services/implementations';
import container from '../services/inversify.config';
import { TYPES } from '../services/types/types';

const _consultWebUserService = container.get<ConsultWebUserService>(TYPES.ConsultWebUserService);

export async function getConsultWebUser(request: Request, response: Response): Promise<Response> {
  const repcuil = UtilsService.getRepresentedCuil(request);
  const userCuil = repcuil || UtilsService.getUserCuil(request);
  return _consultWebUserService
    .getConsultWebUser(userCuil)
    .then((x: ConsultaUsuarioWeb[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function getAffairs(request: Request, response: Response): Promise<Response> {
  const userCuil = UtilsService.getRepresentedCuil(request) || UtilsService.getUserCuil(request);
  return _consultWebUserService
    .getAffairs(userCuil)
    .then((x: ComboResultado[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function getBenefit(request: Request, response: Response): Promise<Response> {
  const userCuil = UtilsService.getRepresentedCuil(request) || UtilsService.getUserCuil(request);
  return _consultWebUserService
    .getBenefit(userCuil)
    .then((x: Beneficio[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function validateAffair(request: Request, response: Response): Promise<Response> {
  const payload: ConsultaUsuarioWeb = request.body;
  payload.cuil = +(UtilsService.getRepresentedCuil(request) || UtilsService.getUserCuil(request));
  return _consultWebUserService
    .validateAffair(payload)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function registerConsult(request: Request, response: Response): Promise<Response> {
  const payload: ConsultaUsuarioWeb = request.body;
  payload.idUsuario = UtilsService.getUserId(request);
  payload.cuil = +(UtilsService.getRepresentedCuil(request) || UtilsService.getUserCuil(request));
  return _consultWebUserService
    .register(payload, request)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

async function getConsultasUsuario(request: Request): Promise<ConsultaUsuarioWeb[]> {
  const repcuil = UtilsService.getRepresentedCuil(request);
  const userCuil = repcuil || UtilsService.getUserCuil(request);
  const consultasUsuario = await _consultWebUserService.getConsultWebUser(userCuil);
  return consultasUsuario;
}

export async function updateConsult(request: Request, response: Response): Promise<Response> {
  const payload: ConsultaUsuarioWeb = request.body;
  payload.idUsuario = UtilsService.getUserId(request);
  payload.cuil = +UtilsService.getUserCuil(request);

  const consultasUsuario = await getConsultasUsuario(request);

  if (!payload.cuilEmpleado) {
    if (!consultasUsuario.some((consulta) => consulta.id === payload.id)) {
      const errorMessage = 'No posee permisos para realizar esta acción.';
      logger.error(errorMessage);
      return response.status(HttpCodes.CONFLICT).json(errorMessage);
    }
  }

  return _consultWebUserService
    .update(payload, request)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function getConsultById(request: Request, response: Response): Promise<Response> {
  return _consultWebUserService
    .getConsultById(request, +request.params.id)
    .then((x: ConsultaUsuarioWeb) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function canAppendDocument(request: Request, response: Response): Promise<Response> {
  return _consultWebUserService
    .canAppendDocument(+request.params.id)
    .then((x: ValidacionAdjuntarDocumento) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function getConsultDocuments(request: Request, response: Response): Promise<Response> {
  const idCousult = +request.params.id;
  const cuil = UtilsService.getRepresentedCuil(request) || UtilsService.getUserCuil(request);
  const isEmployee = UtilsService.isEmployee(request);
  const consultUserList = await _consultWebUserService.getConsultWebUser(cuil);

  const isValidId = consultUserList.some((consult) => consult.id === idCousult);

  if (!isEmployee && !isValidId) {
    return response.status(HttpCodes.FORBIDDEN).json();
  }
  return _consultWebUserService
    .getConsultDocuments(idCousult)
    .then((x: ArchivoGenerico[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function getAreaAndOffice(request: Request, response: Response): Promise<Response> {
  return _consultWebUserService
    .getAreaAndOffice(+request.params.id)
    .then((x: UbicacionReclamo) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function validateNewDocument(request: Request, response: Response): Promise<Response> {
  return _consultWebUserService
    .validateNewDocument(request.body, UtilsService.getUserCuil(request))
    .then((x: string) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function getStates(request: Request, response: Response): Promise<Response> {
  return _consultWebUserService
    .getStates()
    .then((x: ComboResultado[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function getStatesHistory(request: Request, response: Response): Promise<Response> {
  return _consultWebUserService
    .getStatesHistory(+request.params.id)
    .then((x: EstadoConsulta[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function addAffair(request: Request, response: Response): Promise<Response> {
  const userCuil = UtilsService.getRepresentedCuil(request) || UtilsService.getUserCuil(request);
  const affairId = +request.params.idAsunto;
  return _consultWebUserService
    .addAffair(userCuil, affairId)
    .then((x: ComboResultado[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

async function getMessageConsultById(request: Request, response: Response): Promise<Response> {
  try {
    const id: number = +request.params.id;
    const internMessages: boolean | null = request.params.interno ? request.params.interno === 'true' : null;
    const result = await _consultWebUserService.getMessageConsultById(id, internMessages);
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

export const ConsultWebUserController = {
  getConsultWebUser,
  getAffairs,
  getBenefit,
  validateAffair,
  registerConsult,
  updateConsult,
  getConsultById,
  canAppendDocument,
  getConsultDocuments,
  getAreaAndOffice,
  validateNewDocument,
  getStates,
  getStatesHistory,
  addAffair,
  getMessageConsultById
};
