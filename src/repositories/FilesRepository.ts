import PoolDb from '../data/db';
import { logger } from '../logger/CustomLogger';
import { Archivo } from '../models/Archivo';
import { injectable } from 'inversify';

export interface IFilesRepository {
  obtenerArchivoPorNombreOriginal(nombreOriginal: string): Promise<string | null>;
  insertarArchivo(datosArchivo: Archivo): Promise<{ id: number }>;
}

@injectable()
export class FilesRepository implements IFilesRepository {
  public async insertarArchivo(datosArchivo: Archivo): Promise<{ id: number }> {
    try {
      const client = await PoolDb.connect();
      const params = [datosArchivo.nombre, datosArchivo.ruta, datosArchivo.fechaSubida, datosArchivo.tipo, datosArchivo.tamano];

      const query = `INSERT INTO archivo (narchivo, ruta, fechaSubida, tipo, tamano) VALUES ($1, $2, $3, $4, $5) RETURNING idarchivo`;
      const result = await client.query(query, params);
      return { id: result.rows[0].idarchivo };
    } catch (error) {
      logger.error('Error al guardar archivo: ' + error);
      throw new Error('Error al guardar el archivo.');
    }
  }

  async obtenerArchivoPorNombreOriginal(nombreOriginal: string): Promise<string | null> {
    const client = await PoolDb.connect();
    const query = 'SELECT narchivo FROM archivo WHERE narchivo= $1';

    try {
      const res = await client.query(query, [nombreOriginal]);
      return res.rows.length > 0 ? res.rows[0].narchivo : null;
    } catch (err) {
      logger.error('Error al recuperar archivo: ' + err);
      throw new Error('Error al recuperar archivo.');
    } finally {
      client.release();
    }
  }
}
