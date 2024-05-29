import { plainToClass } from 'class-transformer';
import { injectable } from 'inversify';
import { StoreProcedureDb } from 'oracle-sp-types';
import { ComboResultado, SpResult } from '../models';
import { ComandoAdministracionConsultas } from '../models/ComandoAdministracionConsultas';
import { RespuestaAdministracionConsulta } from '../models/RespuestaAdministracionConsulta';
import { Asunto } from '../models/Asunto';
import { NivelUsuario } from '../models/NivelUsuario';
import { AccionDetalleConsulta } from '../models/AccionDetalleConsulta';
import { AreaRecursosHumanos } from '../models/AreaRecursosHumanos';
import { UnidadOperativaRecursosHumanos } from '../models/UnidadOperativaRecursosHumanos';
import { EmpleadoRh } from '../models/ComandoEmpleadoRh';
import { Connection } from 'oracledb';

export interface IConsultManagmentRepository {
  getConsultDetail(id: number): Promise<boolean>;
  getStatesConsult(): Promise<ComboResultado[]>;
  getAreasConsult(): Promise<ComboResultado[]>;
  getOfficesConsult(area: string): Promise<ComboResultado[]>;
  getSubjectsConsult(userCuil: string, closeConsult: string): Promise<ComboResultado[]>;
  getConsultByFilters(payload: ComandoAdministracionConsultas): Promise<RespuestaAdministracionConsulta[]>;
  getIssues(): Promise<Asunto[]>;
  getNivelPermisoConsulta(cuil: string): Promise<NivelUsuario>;
  getEmpleadosHabilitados(cuil: string): Promise<ComboResultado[]>;
  asignarLiberar(idConsulta: string, idUsuario: string): Promise<void>;
  marcarDesmarcar(idConsulta: string): Promise<void>;
  changeIssue(consultId: number, issueId: number): Promise<SpResult>;
  getActionsById(consultId: number): Promise<AccionDetalleConsulta[]>;
  getRhAreas(): Promise<AreaRecursosHumanos[]>;
  getRhUnitOperationByArea(area: string): Promise<UnidadOperativaRecursosHumanos[]>;
  getEmployeesByAreaAndUnit(area: string, unidad: string): Promise<EmpleadoRh[]>;
  deriveConsult(consultId: number, area: string, unidad: string): Promise<SpResult>;
  getPermissionsByCuil(consultId: number, cuil: string): Promise<SpResult>;
  changeConsultState(consultId: number, stateId: number, connection?: Connection): Promise<SpResult>;
}

@injectable()
export class ConsultManagmentRepository implements IConsultManagmentRepository {
  public async getConsultDetail(id: number): Promise<boolean> {
    //const params: unknown[] = [id];
    //const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_VALIDAR_ENCUESTA_FINALIZADA', params);
    //return await sp.executeSp().then(
    //  async (x: SpResult[]) =>
    //    plainToClass(SpResult, x[0], {
    //      excludeExtraneousValues: true
    //    }).mensaje === 'S'
    //);
    return true;
  }

  /**
   * Método asíncrono para consultar los combos de estados
   * @returns {ConsultaUsuarioWeb[] } - devuelve un array de ComboResultado
   */
  async getStatesConsult(): Promise<ComboResultado[]> {
    const params: unknown[] = [];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_OBT_ESTADOS_CONSULTAS_EMPLEADO', params);
    return await sp.executeSp().then(async (x: ComboResultado[]) => {
      const result: ComboResultado[] = plainToClass(ComboResultado, x, {
        excludeExtraneousValues: true
      });
      return result;
    });
  }

  /**
   * Método asíncrono para consultar los  combos de áreas
   * @param {string} userCuil - cuil del usuario logueado
   * @returns {ConsultaUsuarioWeb[] } - devuelve un array de ComboResultado
   */
  async getAreasConsult(): Promise<ComboResultado[]> {
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_OBT_AREAS', null);
    return await sp.executeSp().then(async (x: ComboResultado[]) => {
      const result: ComboResultado[] = plainToClass(ComboResultado, x, {
        excludeExtraneousValues: true
      });
      return result;
    });
  }

  /**
   * Método asíncrono para consultar los asuntos disponibles para una nueva consulta
   * @param {string} userCuil - cuil del usuario logueado
   * @returns {ConsultaUsuarioWeb[] } - devuelve un array de ComboResultado
   */
  async getOfficesConsult(area: string): Promise<ComboResultado[]> {
    const params: unknown[] = [area];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_OBT_OFICINAS', params);
    return await sp.executeSp().then(async (x: ComboResultado[]) => {
      const result: ComboResultado[] = plainToClass(ComboResultado, x, {
        excludeExtraneousValues: true
      });
      return result;
    });
  }

  async getSubjectsConsult(userCuil: string, closeConsult: string): Promise<ComboResultado[]> {
    const params: unknown[] = [userCuil, closeConsult];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_OBT_ASUNTOS_EMPLEADO', params);
    return await sp.executeSp().then(async (x: ComboResultado[]) => {
      const result: ComboResultado[] = plainToClass(ComboResultado, x, {
        excludeExtraneousValues: true
      });
      return result;
    });
  }

  /**
   * Método asíncrono para consultar los consultas por filtros
   * @param {string} userCuil - cuil del usuario logueado
   * @returns {ConsultaUsuarioWeb[] } - devuelve un array de ComboResultado
   */
  async getConsultByFilters(payload: ComandoAdministracionConsultas): Promise<RespuestaAdministracionConsulta[]> {
    const params: unknown[] = [
      payload.cuil?.trim()?.length > 0 ? payload.cuil : null,
      payload.idArea != -1 ? payload.idArea : null,
      payload.idOficina != -1 ? payload.idOficina : null,
      payload.idAsunto != -1 ? payload.idAsunto : null,
      payload.numero,
      payload.solicitud,
      payload.idEstado != -1 ? payload.idEstado : null,
      payload.usuario,
      payload.fechaDesde,
      payload.fechaHasta,
      payload.consultasCerradas ? 'S' : 'N',
      payload.consultasMarcadas ? 'S' : 'N'
    ];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_OBT_CONSULTAS_EMPLEADO', params);
    return await sp.executeSp().then(async (x: RespuestaAdministracionConsulta[]) => {
      const result: RespuestaAdministracionConsulta[] = plainToClass(RespuestaAdministracionConsulta, x, {
        excludeExtraneousValues: true
      });
      return result;
    });
  }

  /**
   * Método asíncrono para consultar los asuntos disponibles
   * @returns {Asunto[] } - devuelve un array de Asunto
   */
  async getIssues(): Promise<Asunto[]> {
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_OBT_TIPOLOGIAS_HABILITADAS_DET_CONSULTA');
    return await sp.executeSp().then(async (x: Asunto[]) => {
      const result: Asunto[] = plainToClass(Asunto, x, {
        excludeExtraneousValues: true
      });
      return result;
    });
  }

  /**
   * Método asíncrono para modificar el asunto de una consulta
   * @param consultId
   * @param issueId
   * @returns { SpResult }
   */
  async changeIssue(consultId: number, issueId: number): Promise<SpResult> {
    const params: number[] = [consultId, issueId];

    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_ABM.PR_ACTUALIZAR_ASUNTO_DETALLE_CONSULTA', params, true);
    return await sp.executeSp().then(async (x: SpResult[]) => {
      const result: SpResult = plainToClass(SpResult, x[0], {
        excludeExtraneousValues: true
      });
      return result;
    });
  }

  /**
   * Método asíncrono para obtener las acciones disponibles segun el id de la consulta.
   * @param consultId
   * @returns { AccionDetalleConsulta[] }
   */
  async getActionsById(consultId: number): Promise<AccionDetalleConsulta[]> {
    const params: number[] = [consultId];

    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_OBT_COMBO_ACCION_DETALLE_CONSULTA', params);
    return await sp.executeSp().then(async (x: AccionDetalleConsulta[]) => {
      const result: AccionDetalleConsulta[] = plainToClass(AccionDetalleConsulta, x, {
        excludeExtraneousValues: true
      });
      return result;
    });
  }

  /**
   * Método asíncrono para consultar las areas de recursos humanos
   * @returns {AreaRecursosHumanos[] } - devuelve un array de AreaRecursosHumanos
   */
  async getRhAreas(): Promise<AreaRecursosHumanos[]> {
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_OBT_AREAS');
    return await sp.executeSp().then(async (x: AreaRecursosHumanos[]) => {
      const result: AreaRecursosHumanos[] = plainToClass(AreaRecursosHumanos, x, {
        excludeExtraneousValues: true
      });
      return result;
    });
  }

  /**
   * Método asíncrono para consultar las unidades operativas segun el area RH
   * @param {area} - Codigo de area
   * @returns {UnidadOperativaRecursosHumanos[] } - devuelve un array de UnidadOperativaRecursosHumanos
   */
  async getRhUnitOperationByArea(area: string): Promise<UnidadOperativaRecursosHumanos[]> {
    const params: string[] = [area];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_OBT_OFICINAS', params);
    return await sp.executeSp().then(async (x: UnidadOperativaRecursosHumanos[]) => {
      const result: UnidadOperativaRecursosHumanos[] = plainToClass(UnidadOperativaRecursosHumanos, x, {
        excludeExtraneousValues: true
      });
      return result;
    });
  }

  /**
   * Método asíncrono para consultar los empleados segun area y unidad
   * @param {area} - Codigo de area
   * @param {unidad} - Codigo de unidad
   * @returns {EmpleadoRh[] } - devuelve un array de EmpleadoRh
   */
  async getEmployeesByAreaAndUnit(area: string, unidad: string): Promise<EmpleadoRh[]> {
    const params: string[] = [area, unidad];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_OBT_EMPLEADOS_UNIDAD_OPERATIVA', params);
    return await sp.executeSp().then(async (x: EmpleadoRh[]) => {
      const result: EmpleadoRh[] = plainToClass(EmpleadoRh, x, {
        excludeExtraneousValues: true
      });
      return result;
    });
  }

  /**
   * Método asíncrono para derivar una consulta a una area y unidad determinada
   * @param consultId
   * @param area
   * @param unidad
   * @returns { SpResult }
   */
  async deriveConsult(consultId: number, area: string, unidad: string): Promise<SpResult> {
    const params: any[] = [consultId, area, unidad];

    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_ABM.PR_CERRAR_DERIVACION_CONSULTA', params, true);
    return await sp.executeSp().then(async (x: SpResult[]) => {
      const result: SpResult = plainToClass(SpResult, x[0], {
        excludeExtraneousValues: true
      });
      return result;
    });
  }

  async getNivelPermisoConsulta(cuil: string): Promise<NivelUsuario> {
    const params = [cuil];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_OBT_PERMISO_ADMINISTRADOR', params);
    return await sp.executeSp().then(async (x: NivelUsuario) => {
      const result: NivelUsuario = plainToClass(NivelUsuario, x, {
        excludeExtraneousValues: true
      });
      return result;
    });
  }

  async getEmpleadosHabilitados(cuil: string): Promise<ComboResultado[]> {
    const params = [cuil];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_OBT_EMPLEADOS_HABILITADOS', params);
    return await sp.executeSp().then(async (x: ComboResultado[]) => {
      const result: ComboResultado[] = plainToClass(ComboResultado, x, {
        excludeExtraneousValues: true
      });
      return result;
    });
  }

  async asignarLiberar(idConsulta: string, idUsuario: string): Promise<void> {
    const params = [idConsulta, idUsuario];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_ABM.PR_ASIGNAR_DESASIGNAR_CONSULTA', params, true);
    return await sp.executeSp();
  }

  async marcarDesmarcar(idConsulta: string): Promise<void> {
    const params = [idConsulta];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_ABM.PR_MARCAR_DESMARCAR_CONSULTA', params, true);
    return await sp.executeSp();
  }

  /**
   * Método asíncrono para consultar si el usuario tiene permisos para editar una consulta
   * @param consultId
   * @param cuil
   * @returns { SpResult }
   */
  async getPermissionsByCuil(consultId: number, cuil: string): Promise<SpResult> {
    const params: any[] = [cuil, consultId];

    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_VALIDAR_CONSULTA_CUIL', params);
    return await sp.executeSp().then(async (x: SpResult[]) => {
      const result: SpResult = plainToClass(SpResult, x[0], {
        excludeExtraneousValues: true
      });
      return result;
    });
  }

  /**
   * Método asíncrono para modificar el estado de una consulta
   * @param consultId
   * @param stateId
   * @param {Conecction} connection - conexion cuando necesitamos ejecutar el metodo como transaccion
   * @returns { SpResult }
   */
  async changeConsultState(consultId: number, stateId: number, connection?: Connection): Promise<SpResult> {
    const params: any[] = [stateId, consultId];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_ABM.PR_CAMBIAR_ESTADO', params, true);

    const results: SpResult[] = connection ? await sp.executeTransactionalSp(connection) : await sp.executeSp();

    const result: SpResult[] = plainToClass(SpResult, results, {
      excludeExtraneousValues: true
    });

    return result[0];
  }
}
