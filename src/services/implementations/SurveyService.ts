import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../types/types';
import { logger } from '../../logger/CustomLogger';
import { ComandoEncuesta, Pregunta, SpResult } from '../../models';
import { ISurveyRepository } from '../../repositories';

export interface ISurveyService {
  validateSurvey(hash: string): Promise<boolean>;
  getQuestions(hash: string): Promise<Pregunta[]>;
  saveOption(payload: ComandoEncuesta): Promise<SpResult>;
  saveComment(payload: ComandoEncuesta): Promise<SpResult>;
  deleteAnswer(payload: ComandoEncuesta): Promise<SpResult>;
  finishSurvey(hash: string): Promise<SpResult>;
}

@injectable()
export class SurveyService implements ISurveyService {
  private readonly _surveyRepository: ISurveyRepository;

  constructor(@inject(TYPES.SurveyRepository) repository: ISurveyRepository) {
    this._surveyRepository = repository;
  }

  public async validateSurvey(hash: string): Promise<boolean> {
    try {
      return await this._surveyRepository.validateSurvey(hash);
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }

  public async getQuestions(hash: string): Promise<Pregunta[]> {
    try {
      const questions = await this._surveyRepository.getQuestions(hash);

      for (let i = 0; i < questions.length; i++) {
        questions[i].detallesPregunta = await this._surveyRepository.getQuestionDetail(questions[i].idPregunta);
      }

      return questions;
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }

  public async saveOption(payload: ComandoEncuesta): Promise<SpResult> {
    try {
      return await this._surveyRepository.saveOption(payload);
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }

  public async saveComment(payload: ComandoEncuesta): Promise<SpResult> {
    try {
      return await this._surveyRepository.saveComment(payload);
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }

  public async deleteAnswer(payload: ComandoEncuesta): Promise<SpResult> {
    try {
      return await this._surveyRepository.deleteAnswer(payload);
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }

  public async finishSurvey(hash: string): Promise<SpResult> {
    try {
      const result = await this._surveyRepository.finishSurvey(hash);
      if (result.mensaje !== 'OK') {
        throw new Error(result.error);
      }
      return result;
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }
}
