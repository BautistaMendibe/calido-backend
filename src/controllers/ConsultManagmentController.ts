import { Request, Response } from 'express';
import { ConsultaUsuarioWeb, HttpCodes } from '../models';
import { logger } from '../logger/CustomLogger';
import container from '../services/inversify.config';
import { TYPES } from '../services/types/types';
import { ConsultManagmentService } from '../services/implementations/ConsultManagmentService';
import { ComandoAdministracionConsultas } from '../models/ComandoAdministracionConsultas';
import { UtilsService } from '../services/implementations';

const _consultManagmentService = container.get<ConsultManagmentService>(TYPES.ConsultManagmentService);

async function getConsultDetail(request: Request, response: Response): Promise<Response> {
  const consultId: number = +request.params.id;
  try {
    const result = await _consultManagmentService.getConsultDetail(consultId);
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

async function getStatesConsult(request: Request, response: Response): Promise<Response> {
  try {
    const result = await _consultManagmentService.getStatesConsult();
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

async function getAreasConsult(request: Request, response: Response): Promise<Response> {
  try {
    const result = await _consultManagmentService.getAreasConsult();
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

async function getOfficesConsult(request: Request, response: Response): Promise<Response> {
  try {
    const area = request.params.area;
    const result = await _consultManagmentService.getOfficesConsult(area);
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

async function getSubjectsConsult(request: Request, response: Response): Promise<Response> {
  try {
    const cuil = UtilsService.getUserCuil(request);
    const closeConsult = request.params.condicion;
    const result = await _consultManagmentService.getSubjectsConsult(cuil, closeConsult);
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

async function getConsultByFilters(request: Request, response: Response): Promise<Response> {
  const filtros: ComandoAdministracionConsultas = request.body;
  try {
    const result = await _consultManagmentService.getConsultByFilters(filtros);
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

async function getIssues(request: Request, response: Response): Promise<Response> {
  try {
    const result = await _consultManagmentService.getIssues();
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

async function changeIssue(request: Request, response: Response): Promise<Response> {
  try {
    const consultId: number = request.body.consultId;
    const issueId: number = request.body.issueId;
    const result = await _consultManagmentService.changeIssue(consultId, issueId);
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

async function getNivelPermisoConsulta(request: Request, response: Response): Promise<Response> {
  try {
    const cuil = UtilsService.getUserCuil(request);
    const result = await _consultManagmentService.getNivelPermisoConsulta(cuil);
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

async function getEmpleadosHabilitados(request: Request, response: Response): Promise<Response> {
  try {
    const cuil = UtilsService.getUserCuil(request);
    const result = await _consultManagmentService.getEmpleadosHabilitados(cuil);
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

async function asignarLiberar(request: Request, response: Response): Promise<Response> {
  try {
    const idConsulta = request.body.idConsulta;
    const idUsuario = request.body.idUsuario;
    const result = await _consultManagmentService.asignarLiberar(idConsulta, idUsuario);
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

async function marcarDesmarcar(request: Request, response: Response): Promise<Response> {
  try {
    const idConsulta = request.body.idConsulta;
    const result = await _consultManagmentService.marcarDesmarcar(idConsulta);
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

async function getActionsById(request: Request, response: Response): Promise<Response> {
  const id: number = +request.params.id;
  try {
    const result = await _consultManagmentService.getActionsById(id);
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

async function getRhAreas(request: Request, response: Response): Promise<Response> {
  try {
    const result = await _consultManagmentService.getRhAreas();
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

async function getRhUnitOperationByArea(request: Request, response: Response): Promise<Response> {
  const area: string = request.params.area;
  try {
    const result = await _consultManagmentService.getRhUnitOperationByArea(area);
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

async function getEmployeesByAreaAndUnit(request: Request, response: Response): Promise<Response> {
  const area: string = request.params.area;
  const unidad: string = request.params.unidad;
  try {
    const result = await _consultManagmentService.getEmployeesByAreaAndUnit(area, unidad);
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

async function deriveConsult(request: Request, response: Response): Promise<Response> {
  const consultId: number = request.body.consultId;
  const area: string = request.body.area;
  const unidad: string = request.body.unidad;
  try {
    const result = await _consultManagmentService.deriveConsult(consultId, area, unidad);
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

async function getPermissionsByCuil(request: Request, response: Response): Promise<Response> {
  const consultId: number = request.body.consultId;
  const cuil: string = request.body.cuil;
  try {
    const result = await _consultManagmentService.getPermissionsByCuil(consultId, cuil);
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

async function changeConsultState(request: Request, response: Response): Promise<Response> {
  const consultId: number = request.body.consultId;
  const stateId: number = request.body.stateId;
  try {
    const result = await _consultManagmentService.changeConsultState(consultId, stateId);
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

async function changeConsultStateWithObservation(request: Request, response: Response): Promise<Response> {
  const consult: ConsultaUsuarioWeb = request.body.consult;
  const stateId: number = request.body.stateId;
  consult.idUsuario = UtilsService.getUserId(request);
  consult.cuil = +UtilsService.getUserCuil(request);

  try {
    const result = await _consultManagmentService.changeConsultStateWithObservation(consult, stateId);
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

export const ConsultManagmentController = {
  getConsultDetail,
  getStatesConsult,
  getAreasConsult,
  getOfficesConsult,
  getSubjectsConsult,
  getConsultByFilters,
  getIssues,
  changeIssue,
  getNivelPermisoConsulta,
  getEmpleadosHabilitados,
  asignarLiberar,
  marcarDesmarcar,
  getActionsById,
  getRhAreas,
  getRhUnitOperationByArea,
  getEmployeesByAreaAndUnit,
  deriveConsult,
  getPermissionsByCuil,
  changeConsultState,
  changeConsultStateWithObservation
};
