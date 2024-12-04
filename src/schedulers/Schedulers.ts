import { schedule } from 'node-cron';
import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import PoolDb from '../data/db';

/**
 * Servicio para manejar tareas programadas
 */
@injectable()
export class Schedulers {
  constructor() {
    this.start(); // Inicia las tareas programadas
  }

  /**
   * Programa tareas, estas tareas se añaden una debajo de otra.
   */
  private start(): void {
    // Tarea programada para expirar promociones todos los días a la 00:01 AM
    schedule('1 0 * * *', async () => {
      await this.expirarPromociones();
    });
  }

  /**
   * Llama a la función 'expirar_promociones' en la base de datos
   */
  private async expirarPromociones(): Promise<void> {
    const client = await PoolDb.connect();
    const fechaEjecucion = new Date().toISOString();
    try {
      await client.query('SELECT public.expirar_promociones();');
      logger.info(`Tarea completada: expirar promociones ejecutada a las ${fechaEjecucion}.`);
    } catch (error) {
      logger.error(`Error al ejecutar expirar_promociones a las ${fechaEjecucion}:`, error);
    } finally {
      client.release();
    }
  }
}
