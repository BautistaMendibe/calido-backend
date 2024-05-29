import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../types/types';
import { logger } from '../../logger/CustomLogger';
import { IConsultWebUserRepository, ISurveyRepository } from '../../repositories';
import { IConsultManagmentRepository } from '../../repositories/ConsultManagmentRepository';
import { ComandoAdministracionConsultas } from '../../models/ComandoAdministracionConsultas';
import { RespuestaAdministracionConsulta } from '../../models/RespuestaAdministracionConsulta';
import { ComboResultado, ConsultaUsuarioWeb, RespuestaCustom, SpResult } from '../../models';
import { Asunto } from '../../models/Asunto';
import { NivelUsuario } from '../../models/NivelUsuario';
import { AccionDetalleConsulta } from '../../models/AccionDetalleConsulta';
import { AreaRecursosHumanos } from '../../models/AreaRecursosHumanos';
import { UnidadOperativaRecursosHumanos } from '../../models/UnidadOperativaRecursosHumanos';
import { EmpleadoRh } from '../../models/ComandoEmpleadoRh';
import { Connection } from 'oracledb';

const oracledb = require('oracledb');

export interface IConsultManagmentService {
  getStatesConsult(): Promise<ComboResultado[]>;
  getAreasConsult(): Promise<ComboResultado[]>;
  getOfficesConsult(area: string): Promise<ComboResultado[]>;
  getSubjectsConsult(userCuil: string, closeConsult: string): Promise<ComboResultado[]>;
  getConsultByFilters(payload: ComandoAdministracionConsultas): Promise<RespuestaAdministracionConsulta[]>;
  getNivelPermisoConsulta(cuil: string): Promise<NivelUsuario>;
  getEmpleadosHabilitados(cuil: string): Promise<ComboResultado[]>;
  asignarLiberar(idConsulta: string, idUsuario: string): Promise<void>;
  marcarDesmarcar(idConsulta: string): Promise<void>;
}

@injectable()
export class ConsultManagmentService implements IConsultManagmentService {
  private readonly _surveyRepository: ISurveyRepository;
  private readonly _consultManagmentRepository: IConsultManagmentRepository;
  private readonly _consultWebUserRepository: IConsultWebUserRepository;

  constructor(
    @inject(TYPES.ConsultManagmentRepository) repository: IConsultManagmentRepository,
    @inject(TYPES.ConsultWebUserRepository) consultWebRepository: IConsultWebUserRepository
  ) {
    this._consultManagmentRepository = repository;
    this._consultWebUserRepository = consultWebRepository;
  }

  public async getConsultDetail(id: number): Promise<boolean> {
    try {
      return await this._consultManagmentRepository.getConsultDetail(id);
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }

  public async getStatesConsult(): Promise<ComboResultado[]> {
    try {
      return await this._consultManagmentRepository.getStatesConsult();
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }

  public async getAreasConsult(): Promise<ComboResultado[]> {
    try {
      return await this._consultManagmentRepository.getAreasConsult();
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }

  public async getOfficesConsult(area: string): Promise<ComboResultado[]> {
    try {
      return await this._consultManagmentRepository.getOfficesConsult(area);
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }

  public async getSubjectsConsult(userCuil: string, closeConsult: string): Promise<ComboResultado[]> {
    try {
      return await this._consultManagmentRepository.getSubjectsConsult(userCuil, closeConsult);
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }

  public async getConsultByFilters(payload: ComandoAdministracionConsultas): Promise<RespuestaAdministracionConsulta[]> {
    try {
      return await this._consultManagmentRepository.getConsultByFilters(payload);
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }

  public async getIssues(): Promise<Asunto[]> {
    try {
      return await this._consultManagmentRepository.getIssues();
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }

  public async changeIssue(consultId: number, issueId: number): Promise<SpResult> {
    try {
      return await this._consultManagmentRepository.changeIssue(consultId, issueId);
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }

  public async getActionsById(consultId: number): Promise<AccionDetalleConsulta[]> {
    try {
      return await this._consultManagmentRepository.getActionsById(consultId);
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }

  public async getRhAreas(): Promise<AreaRecursosHumanos[]> {
    try {
      return await this._consultManagmentRepository.getRhAreas();
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }

  public async getRhUnitOperationByArea(area: string): Promise<UnidadOperativaRecursosHumanos[]> {
    try {
      return await this._consultManagmentRepository.getRhUnitOperationByArea(area);
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }

  public async getEmployeesByAreaAndUnit(area: string, unidad: string): Promise<EmpleadoRh[]> {
    try {
      return await this._consultManagmentRepository.getEmployeesByAreaAndUnit(area, unidad);
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }

  public async deriveConsult(consultId: number, area: string, unidad: string): Promise<SpResult> {
    try {
      return await this._consultManagmentRepository.deriveConsult(consultId, area, unidad);
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }

  public async getNivelPermisoConsulta(cuil: string): Promise<NivelUsuario> {
    try {
      return await this._consultManagmentRepository.getNivelPermisoConsulta(cuil);
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }

  public async getEmpleadosHabilitados(cuil: string): Promise<ComboResultado[]> {
    try {
      return await this._consultManagmentRepository.getEmpleadosHabilitados(cuil);
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }

  public async asignarLiberar(idConsulta: string, idUsuario: string): Promise<void> {
    try {
      return await this._consultManagmentRepository.asignarLiberar(idConsulta, idUsuario);
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }

  public async marcarDesmarcar(idConsulta: string): Promise<void> {
    try {
      return await this._consultManagmentRepository.marcarDesmarcar(idConsulta);
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }

  public async getPermissionsByCuil(consultId: number, cuil: string): Promise<SpResult> {
    try {
      return await this._consultManagmentRepository.getPermissionsByCuil(consultId, cuil);
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }

  public async changeConsultState(consultId: number, stateId: number): Promise<SpResult> {
    try {
      return await this._consultManagmentRepository.changeConsultState(consultId, stateId);
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }

  public async changeConsultStateWithObservation(consult: ConsultaUsuarioWeb, stateId: number): Promise<SpResult> {
    let connection;
    try {
      const pool = oracledb.getPool('caja');
      connection = await pool.getConnection();

      // Se envia la observacion del empleado en la consulta
      const resultObservation = await this._consultWebUserRepository.update(consult, connection);
      if (resultObservation.mensaje != 'OK') {
        throw Error(resultObservation.mensaje);
      }

      // Se cambia el estado a la consulta
      const resultChangeState = await this._consultManagmentRepository.changeConsultState(consult.id, stateId, connection);
      if (resultChangeState.mensaje != 'OK') {
        throw Error(resultChangeState.mensaje);
      }

      await connection.commit();
      await connection.close();

      return new SpResult(null, 'OK', null);
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          logger.error(err);
        }
      }
    }
  }
}
