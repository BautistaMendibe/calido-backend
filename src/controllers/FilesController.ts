import { Request, Response } from 'express';
import { FilesService } from '../services/implementations/FilesService';
import { HttpCodes } from '../models';
import { logger } from '../logger';
import container from '../services/inversify.config';
import { TYPES } from '../services/types/types';

const _filesService = container.get<FilesService>(TYPES.FilesService);

export async function guardarArchivo(request: Request, response: Response): Promise<Response> {
  const file = request.file;

  if (!file) {
    return response.status(HttpCodes.BAD_REQUEST).json({ mensaje: 'No se recibió un archivo.' });
  }

  return _filesService
    .almacenarArchivo(file)
    .then((fileId) => response.status(HttpCodes.OK).json(fileId))
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.INTERNAL_ERROR).json({ mensaje: 'Error al guardar el archivo.' });
    });
}

export async function obtenerArchivo(request: Request, response: Response): Promise<Response> {
  const { nombreOriginal } = request.params;

  return _filesService
    .recuperarArchivo(nombreOriginal)
    .then((fileData) => {
      response.setHeader('Content-Disposition', `attachment; filename="${nombreOriginal}"`);
      return response.status(HttpCodes.OK).send(fileData);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.NOT_FOUND).json({ mensaje: 'Archivo no encontrado.' });
    });
}

export const FilesController = {
  guardarArchivo,
  obtenerArchivo
};
