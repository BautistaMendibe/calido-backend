import { Request, Response } from 'express';
import container from '../services/inversify.config';
import { TYPES } from '../services/types/types';
import { logger } from '../logger/CustomLogger';
import { ComandoEncuesta, HttpCodes } from '../models';
import { SurveyService } from '../services/implementations';

const _surveyService = container.get<SurveyService>(TYPES.SurveyService);

async function validateSurvey(request: Request, response: Response): Promise<Response> {
  const hash = request.params.hash;
  try {
    const result = await _surveyService.validateSurvey(hash);
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

async function getQuestions(request: Request, response: Response): Promise<Response> {
  const hash = request.params.hash;
  try {
    const result = await _surveyService.getQuestions(hash);
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

async function saveOption(request: Request, response: Response): Promise<Response> {
  const payload: ComandoEncuesta = request.body;
  try {
    const result = await _surveyService.saveOption(payload);
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

async function saveComment(request: Request, response: Response): Promise<Response> {
  const payload: ComandoEncuesta = request.body;
  try {
    const result = await _surveyService.saveComment(payload);
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

async function deleteAnswer(request: Request, response: Response): Promise<Response> {
  const payload: ComandoEncuesta = request.body;
  try {
    const result = await _surveyService.deleteAnswer(payload);
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

async function finishSurvey(request: Request, response: Response): Promise<Response> {
  const hash = request.params.hash;
  try {
    const result = await _surveyService.finishSurvey(hash);
    return response.status(HttpCodes.OK).json(result);
  } catch (error) {
    logger.error(error.message);
    return response.status(HttpCodes.CONFLICT).json(error.message);
  }
}

export const SurveyController = {
  validateSurvey,
  getQuestions,
  saveOption,
  saveComment,
  deleteAnswer,
  finishSurvey
};
