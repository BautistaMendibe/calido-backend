import axios from 'axios';
import crypto from 'crypto';
import { Request } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { logger } from '../../logger/CustomLogger';
import { ArchivoGenerico, ComboResultado, ConsultaUsuarioWeb, DocumentoCdd, MensajeConsulta, SpResult } from '../../models';
import { Beneficio } from '../../models/Beneficio';
import { EstadoConsulta } from '../../models/EstadoConsulta';
import { UbicacionReclamo } from '../../models/UbicacionReclamo';
import { ValidacionAdjuntarDocumento } from '../../models/ValidacionAdjuntarDocumento';
import { IConsultWebUserRepository } from '../../repositories';
import { IConsultWebUserService } from '../interfaces';
import { TYPES } from '../types/types';
import { UtilsService } from './UtilsService';

/**
 * Servicio que tiene como responsabilidad
 * todo lo vinculado a el tratamiento de las consultas de usuario web
 */
@injectable()
export class ConsultWebUserService implements IConsultWebUserService {
  private readonly _consultWebUserRepository: IConsultWebUserRepository;

  constructor(
    @inject(TYPES.ConsultWebUserRepository)
    repository: IConsultWebUserRepository
  ) {
    this._consultWebUserRepository = repository;
  }

  public async getConsultWebUser(cuil: string): Promise<ConsultaUsuarioWeb[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._consultWebUserRepository.getConsultWebUser(cuil);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async getAffairs(userCuil: string): Promise<ComboResultado[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._consultWebUserRepository.getAffairs(userCuil);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async getBenefit(cuil: string): Promise<Beneficio[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._consultWebUserRepository.getBenefit(cuil);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async validateAffair(consult: ConsultaUsuarioWeb): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._consultWebUserRepository.validateAffair(consult);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async register(consult: ConsultaUsuarioWeb, request: Request): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        // Se registra la consulta
        const result = await this._consultWebUserRepository.register(consult);
        if (result.mensaje != 'OK') {
          throw new Error(result.mensaje);
        }
        for (const file of consult.archivos) {
          if (!file.agregado) {
            // Si hay archivos sin ID, hay que registrarlos en cdd y en la caja
            if (!file.idArchivo || file.idArchivo < 0) {
              file.sha = this.generateSha1File(file);

              const shaValidation = await this._consultWebUserRepository.validateShaFilePerson(consult.cuil.toString(), file.sha, file.idTipoDocumento);

              if (!shaValidation?.idArchivo) {
                // El documento no existe
                // Guardamos el archivo en CDD utilizando el micro de documentacion
                try {
                  file.idCdd = await this.saveDocumentCdd(file, consult.cuil, request);
                } catch (e) {
                  // this._consultWebUserRepository.registerErrorCidi();
                  console.error('Error de CDD al registrar documento');
                }
                file.nombre = file.nombre.replace(/\.[^/.]+$/, '');
                // Guardamos el archivo en la Caja
                file.idArchivo = await this.saveDocumentCaja(file, consult.cuil);
              } else {
                // El documento existe
                if (shaValidation.mismoTipo === 'N') {
                  // No se registra ya que es de otro tipo
                  continue;
                } else {
                  //	Existe el archivo del mismo tipo
                  file.idArchivo = shaValidation.idArchivo;

                  if (shaValidation.mismaPersona === 'N' && shaValidation.mismoTipo === 'S') {
                    // Vincular el archivo existente a la persona
                    await this._consultWebUserRepository.linkExistingFile(consult.cuil.toString(), file.idTipoDocumento, file.idArchivo);
                  }
                }
              }
            }

            // Relacionamos el archivo con la consulta
            await this.appendConsultFile(result.id, file.idArchivo, consult.cuil);
          }
        }
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  private async saveDocumentCdd(file: ArchivoGenerico, cuil: number, request: Request): Promise<number> {
    let idCdd: number;
    const cddDoc = new DocumentoCdd();
    cddDoc.id_documento = 0;
    cddDoc.id_tipo_documento = file.idTipoDocCdd;
    cddDoc.descripcion = file.tipoDocumento;
    cddDoc.imagen_str = file.base64;
    cddDoc.nombre = file.nombre;
    cddDoc.formato = file.formato;
    const complexBody = {
      documento: cddDoc,
      cuil: cuil,
      cookie: { CiDi: request.cookies.CiDi }
    };
    await axios
      .post(`http://${process.env.URL_DOCUMENTACION}/file/upload`, complexBody, {
        timeout: 40000,
        maxContentLength: 100000000
      })
      .then(async (res) => {
        if (res) {
          idCdd = res.data.id_documento;
        }
      })
      .catch(async (error) => {
        complexBody.documento.id_documento = file.idTipoDocumento;
        await this.saveFileErrorLog(complexBody);

        logger.error(error.response.data);
        if (error.response.data) {
          throw Error(`Error de CDD: ${error.response.data.toString()}`);
        }
        throw Error('Fallo la comunicación con CDD');
      });
    return idCdd;
  }

  private async saveDocumentCaja(file: ArchivoGenerico, cuil: number): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._consultWebUserRepository.registerFile(file, cuil);
        if (result.mensaje != 'OK') {
          throw new Error(result.mensaje);
        }
        resolve(result.id);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  private async appendConsultFile(consultId: number, fileId: number, cuil: number): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._consultWebUserRepository.appendConsultFile(consultId, fileId, cuil);
        if (result.mensaje != 'OK') {
          throw new Error(result.mensaje);
        }
        resolve(result.id);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  private generateSha1File(file: ArchivoGenerico) {
    const buffer = Buffer.from(file.base64, 'base64');
    const hashArray = new Uint8Array(buffer);
    return crypto.createHash('sha1').update(hashArray).digest('hex').toUpperCase();
  }

  public async update(consult: ConsultaUsuarioWeb, request: Request): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._consultWebUserRepository.update(consult);
        if (result.mensaje != 'OK') {
          resolve(result);
        }
        try {
          for (const file of consult.archivos) {
            if (!file.agregado) {
              file.base64 = file.base64?.replace(/^(.*?,)/gim, '');
              // Si hay archivos sin ID, hay que registrarlos en cdd y en la caja
              if (!file.idArchivo || file.idArchivo < 0) {
                file.sha = this.generateSha1File(file);

                const shaValidation = await this._consultWebUserRepository.validateShaFilePerson(consult.cuil.toString(), file.sha, file.idTipoDocumento);

                if (!shaValidation?.idArchivo) {
                  // El documento no existe
                  // Guardamos el archivo en CDD utilizando el micro de documentacion
                  try {
                    file.idCdd = await this.saveDocumentCdd(file, consult.cuil, request);
                  } catch (e) {
                    // this._consultWebUserRepository.registerErrorCidi();
                    logger.error('Error tipo archivo CDD: ' + file.idTipoDocCdd);
                  }
                  file.nombre = file.nombre.replace(/\.[^/.]+$/, '');
                  // Guardamos el archivo en la Caja
                  file.idArchivo = await this.saveDocumentCaja(file, consult.cuil);
                } else {
                  // El documento existe
                  if (shaValidation.mismaPersona === 'N' && shaValidation.mismoTipo === 'N') {
                    // No se registra
                    continue;
                  } else {
                    //	Existe el archivo del mismo tipo
                    file.idArchivo = shaValidation.idArchivo;

                    if (shaValidation.mismaPersona === 'S' && shaValidation.mismoTipo === 'N') {
                      // No se registra
                      continue;
                    }
                    if (shaValidation.mismaPersona === 'N' && shaValidation.mismoTipo === 'S') {
                      // Vincular el archivo existente a la persona
                      await this._consultWebUserRepository.linkExistingFile(consult.cuil.toString(), file.idTipoDocumento, file.idArchivo);
                    }
                  }
                }
              }

              // Relacionamos el archivo con la consulta
              await this.appendConsultFile(result.id, file.idArchivo, consult.cuil);
            }
          }
        } catch (e) {
          logger.error(e);
        }
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async getConsultById(request: Request, id: number): Promise<ConsultaUsuarioWeb> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._consultWebUserRepository.getConsultById(id);
        const cuil = UtilsService.getRepresentedCuil(request) || UtilsService.getUserCuil(request);
        const isEmployee = UtilsService.isEmployee(request);
        if (result) {
          if (!isEmployee && +result.cuil !== +cuil) {
            throw new Error('No posee permisos para realizar esta acción.');
          }

          result.mensajesConsulta = await this._consultWebUserRepository.getMessageConsultById(id, null);

          result.mensajesConsulta.forEach((mensaje) => {
            if (mensaje.tipoUsuario) {
              mensaje.nombre = mensaje.tipoUsuario;
            }
          });

          result.archivos = await this._consultWebUserRepository.getConsultDocuments(id);

          let index = 0;
          for (const file of result.archivos) {
            if (file.idCdd) {
              await this._consultWebUserRepository.getConsultDocsCdd(request, file, cuil).then((res) => {
                result.archivos[index].base64 = res;
              });
            }
            index++;
          }
        }
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async canAppendDocument(id: number): Promise<ValidacionAdjuntarDocumento> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._consultWebUserRepository.canAppendDocument(id);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async getConsultDocuments(id: number): Promise<ArchivoGenerico[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._consultWebUserRepository.getConsultDocuments(id);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async validateNewDocument(file: ArchivoGenerico, cuil: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        file.sha = this.generateSha1File(file);

        const shaValidation = await this._consultWebUserRepository.validateShaFilePerson(cuil, file.sha, file.idTipoDocumento);

        if (shaValidation.mismaPersona === 'S') {
          resolve(`El archivo ya fue cargado en la documentación como "${shaValidation.tipoDocumento}", puede seleccionarlo en la pestaña de archivos existentes.`);
        }

        if (shaValidation?.mismoTipo === 'N') {
          resolve(`El archivo fue cargado por otra persona con el tipo "${shaValidation.tipoDocumento}", solo puede cargarlo con ese tipo.`);
        }

        resolve('');
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async getAreaAndOffice(idAffair: number): Promise<UbicacionReclamo> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._consultWebUserRepository.getAreaAndOffice(idAffair);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async getStates(): Promise<ComboResultado[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._consultWebUserRepository.getStates();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async getStatesHistory(id: number): Promise<EstadoConsulta[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._consultWebUserRepository.getStatesHistory(id);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async addAffair(userCuil: string, affairId: number): Promise<ComboResultado[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._consultWebUserRepository.addAffair(userCuil, affairId);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async getMessageConsultById(id: number, internMessages: boolean): Promise<MensajeConsulta[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._consultWebUserRepository.getMessageConsultById(id, internMessages);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  private async saveFileErrorLog(complexBody: any): Promise<void> {
    await axios
      .post(`http://${process.env.URL_UTILIDADES}/logs/registrar-log-error-archivo`, complexBody, {
        timeout: 40000,
        maxContentLength: 100000000
      })
      .catch(async (error) => {
        logger.error('Error al intentar guardar log de error al subir archivo a CDD: ' + error);
      });
  }
}
