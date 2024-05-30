import { schemaCreateConsultWebUser, schemaEmpty, schemaGetConsultWebBenefit, schemaGetConsultWebUserById, schemaUpdateConsultWebUser } from './middlewares/ValidationSchema';
import { ConsultWebUserController } from './src/controllers';
import { SurveyController } from './src/controllers';
import { ConsultManagmentController } from './src/controllers/ConsultManagmentController';
import { UsersController, validarUsuarioLogeado } from './src/controllers/UsersController';
/**
 * Rutas del Backend.
 */
export const AppRoutes = [
  //#region Consult web user
  {
    path: '/consultas/obtener-consultas-usuario-web',
    method: 'get',
    action: ConsultWebUserController.getConsultWebUser,
    schema: schemaEmpty
  },
  {
    path: '/consultas/obtener-asuntos',
    method: 'get',
    action: ConsultWebUserController.getAffairs,
    schema: schemaEmpty
  },
  {
    path: '/consultas/obtener-beneficio',
    method: 'get',
    action: ConsultWebUserController.getBenefit,
    schema: schemaGetConsultWebBenefit
  },
  {
    path: '/consultas/obtener-area-oficina/:id',
    method: 'get',
    action: ConsultWebUserController.getAreaAndOffice,
    schema: schemaEmpty
  },
  {
    path: '/consultas/validar-asunto',
    method: 'post',
    action: ConsultWebUserController.validateAffair,
    schema: schemaEmpty
  },
  {
    path: '/consultas/registrar-consulta',
    method: 'post',
    action: ConsultWebUserController.registerConsult,
    schema: schemaCreateConsultWebUser
  },
  {
    path: '/consultas/modificar-consulta',
    method: 'post',
    action: ConsultWebUserController.updateConsult,
    schema: schemaUpdateConsultWebUser
  },
  {
    path: '/consultas/consulta-id/:id',
    method: 'get',
    action: ConsultWebUserController.getConsultById,
    schema: schemaGetConsultWebUserById
  },
  {
    path: '/consultas/puede-adjuntar-documentos/:id',
    method: 'get',
    action: ConsultWebUserController.canAppendDocument,
    schema: schemaGetConsultWebUserById
  },
  {
    path: '/consultas/obtener-documentos-consulta/:id',
    method: 'get',
    action: ConsultWebUserController.getConsultDocuments,
    schema: schemaGetConsultWebUserById
  },
  {
    path: '/consultas/validar-documento-nuevo',
    method: 'post',
    action: ConsultWebUserController.validateNewDocument,
    schema: schemaGetConsultWebUserById
  },
  {
    path: '/consultas/obtener-estados',
    method: 'get',
    action: ConsultWebUserController.getStates,
    schema: schemaEmpty
  },
  {
    path: '/consultas/obtener-historial-estados/:id',
    method: 'get',
    action: ConsultWebUserController.getStatesHistory,
    schema: schemaEmpty
  },
  {
    path: '/consultas/agregar-asunto/:idAsunto',
    method: 'get',
    action: ConsultWebUserController.addAffair,
    schema: schemaEmpty
  },
  {
    path: '/consultas/obtener-mensajes-consulta/:id/:interno',
    method: 'get',
    action: ConsultWebUserController.getMessageConsultById,
    schema: schemaEmpty
  },
  // endregion

  // region Encuesta
  {
    path: '/encuesta/validar-encuesta/:hash',
    method: 'get',
    action: SurveyController.validateSurvey,
    schema: schemaEmpty
  },
  {
    path: '/encuesta/obtener-preguntas/:hash',
    method: 'get',
    action: SurveyController.getQuestions,
    schema: schemaEmpty
  },
  {
    path: '/encuesta/guardar-opcion',
    method: 'post',
    action: SurveyController.saveOption,
    schema: schemaEmpty
  },
  {
    path: '/encuesta/guardar-comentario',
    method: 'post',
    action: SurveyController.saveComment,
    schema: schemaEmpty
  },
  {
    path: '/encuesta/borrar-respuesta',
    method: 'post',
    action: SurveyController.deleteAnswer,
    schema: schemaEmpty
  },
  {
    path: '/encuesta/finalizar-encuesta/:hash',
    method: 'get',
    action: SurveyController.finishSurvey,
    schema: schemaEmpty
  },
  //#endregion

  // region Administracion de Consultas
  {
    path: '/administracion-consultas/obtener-detalle-consulta/:id',
    method: 'post',
    action: ConsultManagmentController.getConsultDetail,
    schema: schemaEmpty
  },
  {
    path: '/administracion-consultas/obtener-combo-estados',
    method: 'get',
    action: ConsultManagmentController.getStatesConsult,
    schema: schemaEmpty
  },
  {
    path: '/administracion-consultas/obtener-combo-areas',
    method: 'get',
    action: ConsultManagmentController.getAreasConsult,
    schema: schemaEmpty
  },
  {
    path: '/administracion-consultas/obtener-combo-oficinas/:area',
    method: 'get',
    action: ConsultManagmentController.getOfficesConsult,
    schema: schemaEmpty
  },
  {
    path: '/administracion-consultas/obtener-combo-asuntos/:condicion',
    method: 'get',
    action: ConsultManagmentController.getSubjectsConsult,
    schema: schemaEmpty
  },
  {
    path: '/administracion-consultas/obtener-consulta-por-filtros',
    method: 'post',
    action: ConsultManagmentController.getConsultByFilters,
    schema: schemaEmpty
  },
  {
    path: '/administracion-consultas/obtener-asuntos-disponibles',
    method: 'get',
    action: ConsultManagmentController.getIssues,
    schema: schemaEmpty
  },
  {
    path: '/administracion-consultas/modificar-asunto-consulta',
    method: 'post',
    action: ConsultManagmentController.changeIssue,
    schema: schemaEmpty
  },
  {
    path: '/administracion-consultas/obtener-nivel-usuario',
    method: 'get',
    action: ConsultManagmentController.getNivelPermisoConsulta,
    schema: schemaEmpty
  },
  {
    path: '/administracion-consultas/obtener-empleados-habilitados',
    method: 'get',
    action: ConsultManagmentController.getEmpleadosHabilitados,
    schema: schemaEmpty
  },
  {
    path: '/administracion-consultas/asignar-liberar-consulta',
    method: 'post',
    action: ConsultManagmentController.asignarLiberar,
    schema: schemaEmpty
  },
  {
    path: '/administracion-consultas/marcar-desmarcar-consulta',
    method: 'post',
    action: ConsultManagmentController.marcarDesmarcar,
    schema: schemaEmpty
  },
  {
    path: '/administracion-consultas/obtener-acciones-disponibles/:id',
    method: 'get',
    action: ConsultManagmentController.getActionsById,
    schema: schemaEmpty
  },
  {
    path: '/administracion-consultas/obtener-areas-recursos-humanos',
    method: 'get',
    action: ConsultManagmentController.getRhAreas,
    schema: schemaEmpty
  },
  {
    path: '/administracion-consultas/obtener-unidades-operativas-rh/:area',
    method: 'get',
    action: ConsultManagmentController.getRhUnitOperationByArea,
    schema: schemaEmpty
  },
  {
    path: '/administracion-consultas/obtener-empleados-por-area-unidad/:area/:unidad',
    method: 'get',
    action: ConsultManagmentController.getEmployeesByAreaAndUnit,
    schema: schemaEmpty
  },
  {
    path: '/administracion-consultas/derivar-consulta',
    method: 'post',
    action: ConsultManagmentController.deriveConsult,
    schema: schemaEmpty
  },
  {
    path: '/administracion-consultas/consultar-permisos-consulta-por-cuil',
    method: 'post',
    action: ConsultManagmentController.getPermissionsByCuil,
    schema: schemaEmpty
  },
  {
    path: '/administracion-consultas/cambiar-estado-consulta',
    method: 'post',
    action: ConsultManagmentController.changeConsultState,
    schema: schemaEmpty
  },
  {
    path: '/administracion-consultas/cambiar-estado-consulta-con-observacion',
    method: 'post',
    action: ConsultManagmentController.changeConsultStateWithObservation,
    schema: schemaEmpty
  },
  //#endregion

  // region Usuarios
  {
    path: '/usuarios/validar-usuario-logeado',
    method: 'post',
    action: UsersController.validarUsuarioLogeado,
    schema: schemaEmpty
  }

  //#endregion
];
