import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import { SpResult } from '../models';
import PoolDb from '../data/db';
import { plainToClass } from 'class-transformer';
import { Comprobante } from '../models/Comprobante';
import { FiltrosComprobantes } from '../models/comandos/FiltroComprobantes';
import { TipoComprobante } from '../models/TipoComprobante';
import { Usuario } from '../models/Usuario';
import { DetalleComprobante } from '../models/DetalleComprobante';

/**
 * Interfaz del repositorio de Comprobantes
 */
export interface IComprobantesRepository {
  registarComprobante(comprobante: Comprobante): Promise<SpResult>;
  consultarComprobantes(filtro: FiltrosComprobantes): Promise<Comprobante[]>;
  eliminarComprobante(idComprobante: number): Promise<SpResult>;
  obtenerTiposComprobantes(): Promise<TipoComprobante[]>;
  modificarComprobante(comprobante: Comprobante): Promise<SpResult>;
}

/**
 * Repositorio de alta, modificacion y consultas de comprobantes
 */
@injectable()
export class ComprobantesRepository implements IComprobantesRepository {
  /**
   * Método asíncrono para registrar un comprobante
   * @returns {SpResult}
   * @param comprobante
   */
  async registarComprobante(comprobante: Comprobante): Promise<SpResult> {
    const client = await PoolDb.connect();

    const detalleComprobanteJsonb = JSON.stringify(comprobante.detalleComprobante);

    const params = [
      comprobante.numerocomprobante,
      comprobante.fechaEmision,
      comprobante.idProveedor,
      comprobante.observaciones,
      comprobante.total,
      comprobante.idResponsable,
      comprobante.idReceptor,
      detalleComprobanteJsonb,
      comprobante.idTipoComprobante
    ];

    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_COMPROBANTE($1, $2, $3, $4, $5, $6, $7, $8, $9)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al registrar el comprobante: ' + err);
      throw new Error('Error al registrar el comprobante.');
    } finally {
      client.release();
    }
  }

  /**
   * Método asíncrono para consultar comprobantes
   * @returns {Comprobante[]} arreglo de comprobantes
   * @param filtro
   */
  async consultarComprobantes(filtro: FiltrosComprobantes): Promise<Comprobante[]> {
    const client = await PoolDb.connect();

    const numeroComprobante = filtro.comprobante || null;
    const proveedor = filtro.proveedor || null;
    const fechaEmisionDesde = filtro.fechaEmisionDesde || null;
    const fechaEmisionHasta = filtro.fechaEmisionHasta || null;
    const responsable = filtro.responsable || null;

    const params = [numeroComprobante, proveedor, fechaEmisionDesde, fechaEmisionHasta, responsable];

    try {
      const res = await client.query<Comprobante[]>('SELECT * FROM public.buscar_pedidos($1, $2, $3, $4, $5)', params);

      const comprobantes = res.rows.map((row: any) => {
        // Mapeamos usuarios, tipos de comprobantes y sus relaciones
        const usuarioResponsable: Usuario = plainToClass(Usuario, row, { excludeExtraneousValues: true });
        const usuarioReceptor: Usuario = plainToClass(Usuario, row, { excludeExtraneousValues: true });
        const tipoComprobante: TipoComprobante = plainToClass(TipoComprobante, row, { excludeExtraneousValues: true });

        // Mapeamos los detalles del comprobante
        const detalleComprobante: DetalleComprobante[] = (row.detalles_comprobante || []).map((detalle: any) =>
          plainToClass(DetalleComprobante, detalle, { excludeExtraneousValues: true })
        );

        // Mapeamos el comprobante
        const comprobante: Comprobante = plainToClass(Comprobante, row, { excludeExtraneousValues: true });

        // Establecemos las relaciones del comprobante
        comprobante.responsable = usuarioResponsable;
        comprobante.receptor = usuarioReceptor;
        comprobante.tipoComprobante = tipoComprobante;
        comprobante.detalleComprobante = detalleComprobante;

        return comprobante;
      });

      return comprobantes;
    } catch (err) {
      logger.error('Error al consultar Comprobantes: ' + err);
      throw new Error('Error al consultar Comprobantes.');
    } finally {
      client.release();
    }
  }

  async eliminarComprobante(idComprobante: number): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [idComprobante];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.ELIMINAR_COMPROBANTE($1)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al eliminar el comprobante: ' + err);
      throw new Error('Error al eliminar el comprobante.');
    } finally {
      client.release();
    }
  }

  async obtenerTiposComprobantes(): Promise<TipoComprobante[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<TipoComprobante[]>('SELECT * FROM PUBLIC.TIPO_COMPROBANTE e WHERE e.activo = 1');
      const result: TipoComprobante[] = plainToClass(TipoComprobante, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al consultar Tipos Comprobantes: ' + err);
      throw new Error('Error al consultar Tipos Comprobantes.');
    } finally {
      client.release();
    }
  }

  async modificarComprobante(comprobante: Comprobante): Promise<SpResult> {
    const client = await PoolDb.connect();

    const detalleComprobanteJsonb = JSON.stringify(comprobante.detalleComprobante);

    const params = [
      comprobante.id,
      comprobante.numerocomprobante,
      comprobante.fechaEmision,
      comprobante.idProveedor,
      comprobante.observaciones,
      comprobante.total,
      comprobante.idResponsable,
      comprobante.idReceptor,
      detalleComprobanteJsonb,
      comprobante.idTipoComprobante
    ];

    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.MODIFICAR_COMPROBANTE($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al modificar el comprobante: ' + err);
      throw new Error('Error al modificar el comprobante.');
    } finally {
      client.release();
    }
  }
}
