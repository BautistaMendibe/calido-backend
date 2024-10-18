import { Request, Response } from 'express';
import { logger } from '../logger/CustomLogger';
import { HttpCodes, SpResult } from '../models';
import container from '../services/inversify.config';
import { TYPES } from '../services/types/types';
import { PromocionesService } from '../services/implementations/PromocionesService';
import { Promocion } from '../models/Promocion';
import { FiltrosPromociones } from '../models/comandos/FiltroPromociones';
import path from 'node:path';
import multer from 'multer';
import { Producto } from '../models/Producto';
import * as fs from 'node:fs';

const _promocionesService = container.get<PromocionesService>(TYPES.PromocionesService);

// Carpeta de destino de las imagenes de instagram
const destFolder = path.join(process.cwd(), 'src', 'assets', 'imgs', 'instagram');

// Asegurar que la carpeta de imagenes de instagram exista
if (!fs.existsSync(destFolder)) {
  fs.mkdirSync(destFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Se guarda la imagen en la carpeta de imagenes de instagram
    cb(null, destFolder);
  },
  filename: (req, file, cb) => {
    // Se asigna un nombre único a la imagen
    cb(null, `imagen_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const multerUpload = multer({ storage });

export async function registrarPromocion(request: Request, response: Response): Promise<Response> {
  const promocion: Promocion = request.body;

  return _promocionesService
    .registrarPromocion(promocion)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function consultarPromociones(request: Request, response: Response): Promise<Response> {
  const filtro: FiltrosPromociones = request.body;

  return _promocionesService
    .consultarPromociones(filtro)
    .then((x: Promocion[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function modificarPromocion(request: Request, response: Response): Promise<Response> {
  const promocion: Promocion = request.body;

  return _promocionesService
    .modificarPromocion(promocion)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function eliminarPromocion(request: Request, response: Response): Promise<Response> {
  const idPromocion: number = +request.params.id;

  return _promocionesService
    .eliminarPromocion(idPromocion)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function buscarProductos(request: Request, response: Response): Promise<Response> {
  return _promocionesService
    .buscarProductos()
    .then((x: Producto[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function notificarPromocion(request: Request, response: Response): Promise<Response> {
  return new Promise<Response>((resolve, reject) => {
    multerUpload.single('imagen')(request, response, async (err) => {
      if (err) {
        logger.error(err);
        return resolve(response.status(HttpCodes.BAD_REQUEST).json({ mensaje: 'Error al cargar la imagen' }));
      }

      const file = request.file;
      const comentario = request.body.comentario;

      if (!file) {
        return resolve(response.status(HttpCodes.BAD_REQUEST).json({ mensaje: 'No se ha recibido una imagen' }));
      }

      const fileName = file.filename; // Nombre del archivo cargado

      try {
        const result = await _promocionesService.notificarPromocion(fileName, comentario);
        resolve(response.status(HttpCodes.OK).json({ mensaje: 'OK', resultado: result }));
      } catch (error) {
        logger.error(error);
        resolve(response.status(HttpCodes.CONFLICT).json({ mensaje: 'Error', error: error.message }));
      }
    });
  });
}

export async function buscarPromocionPorProducto(request: Request, response: Response): Promise<Response> {
  const idProducto: number = +request.params.idProducto;
  return _promocionesService
    .buscarPromocionPorProducto(idProducto)
    .then((x: Promocion[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export const PromocionesController = {
  registrarPromocion,
  consultarPromociones,
  modificarPromocion,
  eliminarPromocion,
  buscarProductos,
  notificarPromocion,
  buscarPromocionPorProducto
};
