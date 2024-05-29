import { plainToClass } from 'class-transformer';
import { injectable } from 'inversify';
import { StoreProcedureDb } from 'oracle-sp-types';
import { ComandoEncuesta, DetallePregunta, Pregunta, SpResult } from '../models';

export interface ISurveyRepository {
  validateSurvey(hash: string): Promise<boolean>;
  getQuestions(hash: string): Promise<Pregunta[]>;
  getQuestionDetail(questionId: number): Promise<DetallePregunta[]>;
  saveOption(payload: ComandoEncuesta): Promise<SpResult>;
  saveComment(payload: ComandoEncuesta): Promise<SpResult>;
  deleteAnswer(payload: ComandoEncuesta): Promise<SpResult>;
  finishSurvey(hash: string): Promise<SpResult>;
}

@injectable()
export class SurveyRepository implements ISurveyRepository {
  public async validateSurvey(hash: string): Promise<boolean> {
    const params: unknown[] = [hash];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_VALIDAR_ENCUESTA_FINALIZADA', params);
    return await sp.executeSp().then(
      async (x: SpResult[]) =>
        plainToClass(SpResult, x[0], {
          excludeExtraneousValues: true
        }).mensaje === 'S'
    );
  }

  public async getQuestions(hash: string): Promise<Pregunta[]> {
    const params: unknown[] = [hash];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_OBT_PREGUNTAS', params);
    return await sp.executeSp().then(async (x: Pregunta[]) =>
      plainToClass(Pregunta, x, {
        excludeExtraneousValues: true
      })
    );
  }

  public async getQuestionDetail(questionId: number): Promise<DetallePregunta[]> {
    const params: unknown[] = [questionId];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_OBT_DETALLE_DE_PREGUNTA', params);
    return await sp.executeSp().then(async (x: DetallePregunta[]) =>
      plainToClass(DetallePregunta, x, {
        excludeExtraneousValues: true
      })
    );
  }

  public async saveOption(payload: ComandoEncuesta): Promise<SpResult> {
    const params: unknown[] = [payload.idPregunta, null, payload.idOpcion];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_GUARDAR_RESPUESTA', params, true);
    return await sp.executeSp().then(async (x: SpResult[]) =>
      plainToClass(SpResult, x[0], {
        excludeExtraneousValues: true
      })
    );
  }

  public async saveComment(payload: ComandoEncuesta): Promise<SpResult> {
    const params: unknown[] = [payload.idPregunta, payload.comentario, null];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_GUARDAR_RESPUESTA', params, true);
    return await sp.executeSp().then(async (x: SpResult[]) =>
      plainToClass(SpResult, x[0], {
        excludeExtraneousValues: true
      })
    );
  }

  public async deleteAnswer(payload: ComandoEncuesta): Promise<SpResult> {
    const params: unknown[] = [payload.idPregunta, payload.idOpcion];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_BORRAR_RESPUESTA', params, true);
    return await sp.executeSp().then(async (x: SpResult[]) =>
      plainToClass(SpResult, x[0], {
        excludeExtraneousValues: true
      })
    );
  }

  public async finishSurvey(hash: string): Promise<SpResult> {
    const params: unknown[] = [hash];
    const sp = new StoreProcedureDb('PKG_RECLAMOS_USR_WEB_CONSULTAS.PR_FINALIZAR_ENCUESTA', params, true);
    return await sp.executeSp().then(async (x: SpResult[]) =>
      plainToClass(SpResult, x[0], {
        excludeExtraneousValues: true
      })
    );
  }
}
