import { Request, Response } from 'express';
import { HttpCodes } from '../models';
import { logger } from '../logger/CustomLogger';
import container from '../services/inversify.config';
import { TYPES } from '../services/types/types';
import { ReportesService } from '../services/implementations/ReportesService';
import { ReporteComando } from '../models/comandos/Reporte';
import { DataReporteComando } from '../models/comandos/DataReporte';

const _reportesService = container.get<ReportesService>(TYPES.ReportesService);

export async function obtenerDataReporte(request: Request, response: Response): Promise<Response> {
  const reporte: ReporteComando = request.body.reporte;
  return _reportesService
    .obtenerDataReporte(reporte)
    .then((x: DataReporteComando[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export const ReportesController = {
  obtenerDataReporte
};
