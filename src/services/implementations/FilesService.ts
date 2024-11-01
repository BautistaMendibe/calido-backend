import { IFilesService } from '../interfaces/IFilesService';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../logger/CustomLogger';
import { IFilesRepository } from '../../repositories/FilesRepository';
import { Archivo } from '../../models/Archivo';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types/types';

// Carpeta de destino de uploads en general de archivos
const destFolder = path.join(process.cwd(), 'src', 'assets', 'uploads');

// Asegurar que la carpeta de imagenes de instagram exista
if (!fs.existsSync(destFolder)) {
  fs.mkdirSync(destFolder, { recursive: true });
}

@injectable()
export class FilesService implements IFilesService {
  private readonly _filesRepository: IFilesRepository;

  constructor(@inject(TYPES.FilesRepository) repository: IFilesRepository) {
    this._filesRepository = repository;
  }

  public async almacenarArchivo(file: Express.Multer.File): Promise<{ nombreArchivo: string; fileId: number }> {
    return new Promise(async (resolve, reject) => {
      try {
        // Genera un nombre único para el archivo
        const nombreUnico = `${uuidv4()}_${file.originalname}`;
        const filePath = path.join(destFolder, nombreUnico);

        // Guarda el archivo en el sistema de archivos
        await fs.promises.writeFile(filePath, file.buffer);

        // Crea una instancia de Archivo
        const archivo = new Archivo();
        archivo.nombre = nombreUnico;
        archivo.ruta = filePath;
        archivo.tamano = file.size;
        archivo.tipo = file.mimetype;
        archivo.fechaSubida = new Date();

        // Pasar la instancia de Archivo al repositorio para ser guardado en BD
        const fileRecord = await this._filesRepository.insertarArchivo(archivo);

        resolve({ nombreArchivo: nombreUnico, fileId: fileRecord.id });
      } catch (error) {
        logger.error('Error al guardar archivo: ' + error);
        reject(new Error('Error al guardar el archivo.'));
      }
    });
  }

  public async recuperarArchivo(nombreOriginal: string): Promise<Buffer | null> {
    const nombreUnico = await this._filesRepository.obtenerArchivoPorNombreOriginal(nombreOriginal);

    if (!nombreUnico) {
      throw new Error('Archivo no encontrado.');
    }

    return new Promise((resolve, reject) => {
      const filePath = path.join(destFolder, nombreUnico);
      fs.readFile(filePath, (err, data) => {
        if (err) {
          logger.error(`Error al recuperar archivo: ${err}`);
          reject('Archivo no encontrado.');
        }
        resolve(data);
      });
    });
  }
}
