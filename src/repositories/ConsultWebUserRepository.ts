import axios from 'axios';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { injectable } from 'inversify';
import { StoreProcedureDb } from 'oracle-sp-types';
import { logger } from '../logger/CustomLogger';
import { ArchivoGenerico, ComboResultado, ConsultaUsuarioWeb, DocumentoCdd, MensajeConsulta, SpResult } from '../models';
import { Beneficio } from '../models/Beneficio';
import { EstadoConsulta } from '../models/EstadoConsulta';
import { RespuestaValidacionSha } from '../models/RespuestaValidacionSha';
import { UbicacionReclamo } from '../models/UbicacionReclamo';
import { ValidacionAdjuntarDocumento } from '../models/ValidacionAdjuntarDocumento';
import { ValidacionArchivoTipoDocumento } from '../models/ValidacionArchivoTipoDocumento';
import { atob } from 'buffer';
import { Connection } from 'oracledb';

/**
 * Interfaz del repositorio de consultas de usuario web
 */
export interface IConsultWebUserRepository {
  getConsultWebUser(cuil: string): Promise<ConsultaUsuarioWeb[]>;

  getAffairs(userCuil: string): Promise<ComboResultado[]>;

  getBenefit(userCuil: string): Promise<Beneficio[]>;

  validateAffair(consult: ConsultaUsuarioWeb): Promise<SpResult>;

  register(consult: ConsultaUsuarioWeb): Promise<SpResult>;

  update(consult: ConsultaUsuarioWeb, connection?: Connection): Promise<SpResult>;

  registerFile(file: ArchivoGenerico, cuil: number): Promise<SpResult>;

  appendConsultFile(consultId: number, fileId: number, cuil: number): Promise<SpResult>;

  getConsultById(id: number): Promise<ConsultaUsuarioWeb>;

  getAreaAndOffice(id: number): Promise<UbicacionReclamo>;

  getMessageConsultById(id: number, internMessages?: boolean): Promise<MensajeConsulta[]>;

  canAppendDocument(id: number): Promise<ValidacionAdjuntarDocumento>;

  getConsultDocuments(id: number): Promise<ArchivoGenerico[]>;

  validateSingleShaFile(sha: string): Promise<RespuestaValidacionSha>;

  getConsultDocsCdd(request: Request, file: ArchivoGenerico, cuil: string): Promise<string>;

  validateShaFilePerson(cuil: string, sha: string, fileType: number): Promise<ValidacionArchivoTipoDocumento>;

  updateDocId(personId: number, fileId: number, currentDocId: number, newDocId: number): Promise<SpResult>;

  getStates(): Promise<ComboResultado[]>;

  getStatesHistory(id: number): Promise<EstadoConsulta[]>;

  linkExistingFile(cuil: string, docTypeId: number, fileId: number): Promise<SpResult>;

  addAffair(userCuil: string, affairId: number): Promise<ComboResultado[]>;
}

/**
 * Repositorio de alta, modificacion y consultas de usuario web
 */
@injectable()
export class ConsultWebUserRepository implements IConsultWebUserRepository {
  /**
   * Método asíncrono para consultar las consultas del usuario web.
   * @param {string} userCuil - cuil del usuario logueado
   * @returns {ConsultaUsuarioWeb[] } - devuelve un array de ConsultaUsuarioWeb
   */
  async getConsultWebUser(userCuil: string): Promise<ConsultaUsuarioWeb[]> {
    const params: unknown[] = [userCuil];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_OBT_CONSULTAS_USR_WEB', params);
    return await sp.executeSp().then(async (x: ConsultaUsuarioWeb[]) => {
      const result: ConsultaUsuarioWeb[] = plainToClass(ConsultaUsuarioWeb, x, {
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
  async getAffairs(userCuil: string): Promise<ComboResultado[]> {
    const params: unknown[] = [userCuil, null];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_OBT_ASUNTOS', params);
    return await sp.executeSp().then(async (x: ComboResultado[]) => {
      const result: ComboResultado[] = plainToClass(ComboResultado, x, {
        excludeExtraneousValues: true
      });
      return result;
    });
  }

  /**
   * Método asíncrono para consultar los beneficios para una nueva consulta
   * @param {string} cuil - cuil del usuario logueado
   * @returns {Beneficio[] } - devuelve un array de Beneficio
   */
  async getBenefit(cuil: string): Promise<Beneficio[]> {
    const params: unknown[] = [cuil];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_OBT_BENEFICIO', params);
    return await sp.executeSp().then(async (x: Beneficio[]) =>
      plainToClass(Beneficio, x, {
        excludeExtraneousValues: true
      })
    );
  }

  /**
   * Método asíncrono para validar el asunto seleccionado en una nueva consulta de usuario web
   * @param {ConsultaUsuarioWeb} consult - consulta con el cuil de usuario logueado
   * y el id del asunto a validar
   * @returns {SpResult} - devuelve un SpResult indicando si es valido o no y en caso de que no
   * un mensaje indicando el motivo
   */
  async validateAffair(consult: ConsultaUsuarioWeb): Promise<SpResult> {
    const params: unknown[] = [consult.cuil, consult.idAsunto];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_VERIFICAR_ASUNTOS_USR_WEB', params);
    return await sp.executeSp().then(async (x: SpResult[]) => {
      const result: SpResult[] = plainToClass(SpResult, x, {
        excludeExtraneousValues: true
      });
      return result[0];
    });
  }

  /**
   * Método asíncrono para registrar una nueva consulta.
   * @param {ConsultaUsuarioWeb} consult - nueva consulta a registrar
   * @returns {SpResult[] } - devuelve un objeto de SpResult con el id de la consulta generada
   */
  async register(consult: ConsultaUsuarioWeb): Promise<SpResult> {
    const params: unknown[] = [
      consult.cuil,
      consult.cuilRepresentante ?? null,
      consult.idAsunto,
      consult.idBeneficio ? consult.idBeneficio : -1,
      consult.mensaje,
      consult.area ? consult.area : null,
      consult.oficina ? consult.oficina : null
    ];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_ABM.PR_REGISTRAR_CONSULTA_USR_WEB', params, true);
    return await sp.executeSp().then(async (x: SpResult[]) => {
      const result: SpResult[] = plainToClass(SpResult, x, {
        excludeExtraneousValues: true
      });
      return result[0];
    });
  }

  /**
   * Método asíncrono para registrar un nuevo mensaje en la consulta.
   * @param {ConsultaUsuarioWeb} consult - consulta con el mensaje a registrar y su id
   * @param {Conecction} connection - conexion cuando necesitamos ejecutar el metodo como transaccion
   * @returns {SpResult[] } - devuelve un objeto de SpResult con el id de la consulta modificada
   */
  async update(consult: ConsultaUsuarioWeb, connection?: Connection): Promise<SpResult> {
    const params: unknown[] = [consult.id, consult.mensaje, consult.nombreUsuario, consult.mensajeInterno];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_ABM.PR_REGISTRAR_MSJ_CONSULTA_USR_WEB', params, true);

    const results: SpResult[] = connection ? await sp.executeTransactionalSp(connection) : await sp.executeSp();
    const result: SpResult[] = plainToClass(SpResult, results, {
      excludeExtraneousValues: true
    });

    return result[0];
  }

  /**
   * Método asíncrono para registrar un archivo en la caja.
   * @returns {SpResult[] } - devuelve un objeto de SpResult con el id del archivo
   * @param file
   * @param cuil
   */
  async registerFile(file: ArchivoGenerico, cuil: number): Promise<SpResult> {
    const byteCharacters = atob(file.base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const fileName = file.nombre
      .slice(0, 59)
      .replace(/ñ/g, 'n')
      .replace(/Ñ/g, 'N')
      .replace(/[^a-zA-Z0-9]/g, '_');

    const params: unknown[] = [
      cuil.toString(),
      file.formato,
      fileName,
      file.idTipoDocumento,
      file.sha,
      byteArray,
      file.tamanio,
      file.idTipoDocumento,
      file.idCdd ? file.idCdd : null,
      file.idTipoDocCdd,
      cuil.toString()
    ];
    const sp = new StoreProcedureDb('PKG_ARCHIVOS.PR_REGISTRAR_ARCHIVO_X_PERSONA', params, true);
    return await sp.executeSp().then(async (x: SpResult[]) => {
      const result: SpResult[] = plainToClass(SpResult, x, {
        excludeExtraneousValues: true
      });
      return result[0];
    });
  }

  /**
   * Método asíncrono para relacionar un archivo a una consulta.
   * @returns {SpResult[] } - devuelve un objeto de SpResult con el id del archivo
   * @param consultId
   * @param fileId
   * @param cuil
   */
  async appendConsultFile(consultId: number, fileId: number, cuil: number): Promise<SpResult> {
    const params: unknown[] = [consultId, fileId, cuil];
    const sp = new StoreProcedureDb('PKG_ARCHIVOS.PR_VINCULAR_ARCHIVO_CONSULTA', params, true);
    return await sp.executeSp().then(async (x: SpResult[]) => {
      const result: SpResult[] = plainToClass(SpResult, x, {
        excludeExtraneousValues: true
      });
      return result[0];
    });
  }

  /**
   * Método asíncrono para consultar una consulta por id.
   * @param {number} id - id de la consulta
   * @returns {ConsultaUsuarioWeb } - devuelve la consulta del usuario web
   */
  async getConsultById(id: number): Promise<ConsultaUsuarioWeb> {
    const params: unknown[] = [id];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_OBT_CONSULTA_USR_WEB_X_ID', params);
    return await sp.executeSp().then(async (x: ConsultaUsuarioWeb[]) => {
      const result: ConsultaUsuarioWeb[] = plainToClass(ConsultaUsuarioWeb, x, {
        excludeExtraneousValues: true
      });
      return result[0];
    });
  }

  /**
   * Método asíncrono para consultar el area y la oficina a traves del asunto.
   * @param {number} id - id del asunto
   * @returns {UbicacionReclamo } - devuelve el area y la oficina
   */
  async getAreaAndOffice(id: number): Promise<UbicacionReclamo> {
    const params: unknown[] = [id];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_OBT_OFICINAS_AREA_X_ASUNTOS', params);
    return await sp.executeSp().then(async (x: UbicacionReclamo[]) => {
      const result: UbicacionReclamo[] = plainToClass(UbicacionReclamo, x, {
        excludeExtraneousValues: true
      });
      return result[0];
    });
  }

  /**
   * Método asíncrono para consultar mensajes de una consulta especifica por id
   * @param {number} id - id de la consulta
   * @param {boolean} internMessages - Si es true devuelve tambien los mensajes internos de CIDI, si es nulo no los trae.
   * @returns {MensajeConsulta[] } - devuelve un array de MensajeConsulta con sus datos asociados.
   */
  async getMessageConsultById(id: number, internMessages?: boolean): Promise<MensajeConsulta[]> {
    const interno: string = internMessages ? 'S' : 'N';
    const params: unknown[] = [id, interno];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_OBT_CONSULTA_USR_WEB_X_MSJ', params);
    return await sp.executeSp().then(async (x: MensajeConsulta[]) => {
      const result: MensajeConsulta[] = plainToClass(MensajeConsulta, x, {
        excludeExtraneousValues: true
      });
      return result;
    });
  }

  async canAppendDocument(id: number): Promise<ValidacionAdjuntarDocumento> {
    const params: unknown[] = [id];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_VALIDAR_ADJUNTAR_ARCHIVOS', params);
    return await sp.executeSp().then(async (x: ValidacionAdjuntarDocumento[]) => {
      const result: ValidacionAdjuntarDocumento[] = plainToClass(ValidacionAdjuntarDocumento, x, {
        excludeExtraneousValues: true
      });

      if (result?.length && result[0].permite === 'S') {
        result[0].puedeAdjuntar = true;
        return result[0];
      } else {
        const validation = new ValidacionAdjuntarDocumento();
        validation.puedeAdjuntar = false;
        return validation;
      }
    });
  }

  /**
   * Método asíncrono para consultar mensajes de una consulta especifica por id
   * @param {number} id - id de la consulta
   * @returns {MensajeConsulta[] } - devuelve un array de MensajeConsulta con sus datos asociados.
   */
  async getConsultDocuments(id: number): Promise<ArchivoGenerico[]> {
    const params: unknown[] = [id];
    const sp = new StoreProcedureDb('PKG_ARCHIVOS.PR_OBT_DOCUMENTO_X_CONSULTA', params);
    return await sp.executeSp().then(async (x: ArchivoGenerico[]) => {
      const archivos = plainToClass(ArchivoGenerico, x, {
        excludeExtraneousValues: true
      });
      return archivos.filter((archivo) => !archivo.usoInterno);
    });
  }

  async validateSingleShaFile(sha: string): Promise<RespuestaValidacionSha> {
    const params: unknown[] = [sha];
    const sp = new StoreProcedureDb('PKG_ARCHIVOS.PR_VALIDACION_SHA_INDIV', params);
    return await sp.executeSp().then(async (x: RespuestaValidacionSha[]) => {
      const res = plainToClass(RespuestaValidacionSha, x, {
        excludeExtraneousValues: true
      });
      return res?.length ? res[0] : null;
    });
  }

  /**
   * Método asíncrono para obtener documentos de una consulta desde CDD.
   * @param { Request } request - request de express
   * @param { ArchivoGenerico } file - array con información acerca de los archivos a obtener.
   * @param { string } cuil - CUIL de la persona que realiza la consulta.
   */
  async getConsultDocsCdd(request: Request, file: ArchivoGenerico, cuil: string): Promise<string> {
    const cddDoc = new DocumentoCdd();
    cddDoc.id_documento = file.idCdd;
    cddDoc.id_tipo_documento = file.idTipoDocCdd;
    const complexBody = {
      documento: cddDoc,
      cuil: cuil,
      cookie: { CiDi: request.cookies.CiDi }
    };
    return await axios
      .post(`http://${process.env.URL_DOCUMENTACION}/file/get`, complexBody, {
        timeout: 40000
      })
      .then((res) => {
        if (res) return res.data.imagen_str;
      })
      .catch((error) => {
        if (error) {
          logger.info(error);
        }
      });
  }

  async validateShaFilePerson(cuil: string, sha: string, fileType: number): Promise<ValidacionArchivoTipoDocumento> {
    const params = [cuil, sha, fileType];
    const sp = new StoreProcedureDb('PKG_ARCHIVOS.PR_VALIDAR_SHA_EXISTENTE_X_PERSONA_X_TIPO', params);
    return await sp.executeSp().then(async (x: ValidacionArchivoTipoDocumento[]) => {
      if (x.length) {
        return plainToClass(ValidacionArchivoTipoDocumento, x[0], {
          excludeExtraneousValues: true
        });
      }
      return new ValidacionArchivoTipoDocumento();
    });
  }

  async updateDocId(personId: number, fileId: number, currentDocId: number, newDocId: number): Promise<SpResult> {
    const params = [personId, fileId, currentDocId, newDocId];
    const sp = new StoreProcedureDb('PKG_ARCHIVOS.PR_ACTUALIZAR_ID_DOC', params, true);
    return await sp.executeSp().then(async (x: SpResult[]) => {
      return plainToClass(SpResult, x[0], {
        excludeExtraneousValues: true
      });
    });
  }

  /**
   * Método asíncrono para consultar los estados disponibles para consultas generadas.
   * @returns {ComboResultado[] } - devuelve un array de ComboResultado
   */
  async getStates(): Promise<ComboResultado[]> {
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_OBT_ESTADOS_CONSULTAS');
    return await sp.executeSp().then(async (x: ComboResultado[]) => {
      const result: ComboResultado[] = plainToClass(ComboResultado, x, {
        excludeExtraneousValues: true
      });
      return result;
    });
  }

  /**
   * Método asíncrono que devuelve el historial de estados para una consulta dada.
   * @returns {EstadoConsulta[] } - devuelve un array de EstadoConsulta
   */
  async getStatesHistory(id: number): Promise<EstadoConsulta[]> {
    const params = [id];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_OBT_HISTORIAL_CONSULTA', params);
    return await sp.executeSp().then(async (x: EstadoConsulta[]) => {
      const result: EstadoConsulta[] = plainToClass(EstadoConsulta, x, {
        excludeExtraneousValues: true
      });
      return result;
    });
  }

  /**
   * Método asíncrono que vincula un archivo existente (previamente cargado por otra persona) a una persona.
   * @returns {SpResult } - devuelve un SpResult
   */
  async linkExistingFile(cuil: string, docTypeId: number, fileId: number): Promise<SpResult> {
    // el primer cuil es de la persona que realiza la consulta, el segundo cuil es de la persona logueada (siempre va a ser el mismo)
    const params = [fileId, cuil, docTypeId, cuil];
    const sp = new StoreProcedureDb('PKG_ARCHIVOS.PR_VINCULAR_ARCHIVO_PERSONA', params, true);
    return await sp.executeSp().then(async (x: SpResult[]) => {
      const result: SpResult[] = plainToClass(SpResult, x, {
        excludeExtraneousValues: true
      });
      return result[0];
    });
  }

  /**
   * Método asíncrono para agregar un asunto a un usuario.
   * @param {string} userCuil - cuil del usuario logueado
   * @param {number} affairId - id del asunto a agregar
   * @returns {ConsultaUsuarioWeb[] } - devuelve un array de ComboResultado con el asunto agregado
   */
  async addAffair(userCuil: string, affairId: number): Promise<ComboResultado[]> {
    const params: unknown[] = [userCuil, affairId];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_OBT_ASUNTOS', params);
    return await sp.executeSp().then(async (x: ComboResultado[]) => {
      const result: ComboResultado[] = plainToClass(ComboResultado, x, {
        excludeExtraneousValues: true
      });
      return result;
    });
  }
}
