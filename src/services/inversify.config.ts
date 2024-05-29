import { Container } from 'inversify';
import { ConsultWebUserRepository, IConsultWebUserRepository } from '../repositories/ConsultWebUserRepository';
import { ConsultWebUserService, ISurveyService, SurveyService } from './implementations';
import { IConsultWebUserService } from './interfaces';
import { TYPES } from './types/types';
import { ISurveyRepository, SurveyRepository } from '../repositories';
import { ConsultManagmentRepository, IConsultManagmentRepository } from '../repositories/ConsultManagmentRepository';
import { ConsultManagmentService, IConsultManagmentService } from './implementations/ConsultManagmentService';

/**
 * Clase encargada de hacer el registro de todas las interfaces, con sus respectivos tipos e implementaciones
 * para que queden disponibles en el contenedor de injección de dependencias.
 */

const container = new Container();
container.bind<IConsultWebUserRepository>(TYPES.ConsultWebUserRepository).to(ConsultWebUserRepository);
container.bind<IConsultWebUserService>(TYPES.ConsultWebUserService).to(ConsultWebUserService);
container.bind<IConsultManagmentRepository>(TYPES.ConsultManagmentRepository).to(ConsultManagmentRepository);
container.bind<IConsultManagmentService>(TYPES.ConsultManagmentService).to(ConsultManagmentService);
container.bind<ISurveyRepository>(TYPES.SurveyRepository).to(SurveyRepository);
container.bind<ISurveyService>(TYPES.SurveyService).to(SurveyService);
export default container;
