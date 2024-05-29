// Archivo de configuración para inversify sin repositorios
export const TYPES = {
  ConsultWebUserService: Symbol('IConsultWebUserService'),
  ConsultWebUserRepository: Symbol('IConsultWebUserRepository'),
  SurveyService: Symbol('ISurveyService'),
  SurveyRepository: Symbol('ISurveyRepository'),
  ConsultManagmentService: Symbol('IConsultManagmentService'),
  ConsultManagmentRepository: Symbol('IConsultManagmentRepository')
};
