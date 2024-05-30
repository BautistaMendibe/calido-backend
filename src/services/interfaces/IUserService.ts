import { Request } from 'express';
import { ArchivoGenerico, ComboResultado, ConsultaUsuarioWeb, SpResult } from '../../models';
import { Beneficio } from '../../models/Beneficio';
import { ValidacionAdjuntarDocumento } from '../../models/ValidacionAdjuntarDocumento';

export interface IUsersService {
  getConsultWebUser(cuil: string): Promise<ConsultaUsuarioWeb[]>;

  getAffairs(userCuil: string): Promise<ComboResultado[]>;

  getBenefit(userCuil: string): Promise<Beneficio[]>;

  validateAffair(consult: ConsultaUsuarioWeb): Promise<SpResult>;

  register(consult: ConsultaUsuarioWeb, request: Request): Promise<SpResult>;

  update(consult: ConsultaUsuarioWeb, request: Request): Promise<SpResult>;

  getConsultById(request: Request, id: number): Promise<ConsultaUsuarioWeb>;

  canAppendDocument(id: number): Promise<ValidacionAdjuntarDocumento>;

  getConsultDocuments(id: number): Promise<ArchivoGenerico[]>;

  validateNewDocument(file: ArchivoGenerico, cuil: string): Promise<string>;

  addAffair(userCuil: string, affairId: number): Promise<ComboResultado[]>;
}
