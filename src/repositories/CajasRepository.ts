import { injectable } from 'inversify';
import { logger } from '../logger/CustomLogger';
import PoolDb from '../data/db';
import { plainToClass } from 'class-transformer';
import { Caja } from '../models/Caja';
import { SpResult } from '../models';
import { FiltrosCajas } from '../models/comandos/FiltroCaja';
import { FiltrosArqueos } from '../models/comandos/FiltroArqueo';
import { Arqueo } from '../models/Arqueo';
import { EstadoArqueo } from '../models/EstadoArqueo';
import { MovimientoManual } from '../models/MovimientoManual';
import { FormaDePago } from '../models/FormaDePago';
import { Usuario } from '../models/Usuario';
import { TipoMovimientoArqueo } from '../models/TipoMovimientoArqueo';

/**
 * Interfaz del repositorio de cajas
 */
export interface ICajasRepository {
  obtenerCajas(filtro: FiltrosCajas): Promise<Caja[]>;
  registrarCaja(caja: Caja): Promise<SpResult>;
  modificarCaja(caja: Caja): Promise<SpResult>;
  eliminarCaja(idCaja: number): Promise<SpResult>;
  obtenerArqueos(filtro: FiltrosArqueos): Promise<Arqueo[]>;
  registrarArqueo(arqueo: Arqueo): Promise<SpResult>;
  modificarArqueo(arqueo: Arqueo): Promise<SpResult>;
  eliminarArqueo(idArqueo: number): Promise<SpResult>;
  obtenerEstadosArqueo(): Promise<EstadoArqueo[]>;
  registrarMovimientoManual(movimiento: MovimientoManual): Promise<SpResult>;
  eliminarMovimientoManual(idMovimiento: number): Promise<SpResult>;
  obtenerMovimientosManuales(idMovimiento: number): Promise<MovimientoManual[]>;
  cerrarArqueo(arqueo: Arqueo): Promise<SpResult>;
}

/**
 * Repositorio encargado de manejar las cajas (cajas y arqueos)
 */
@injectable()
export class CajasRepository implements ICajasRepository {
  async obtenerCajas(filtro: FiltrosCajas): Promise<Caja[]> {
    const client = await PoolDb.connect();

    const params = [filtro.nombre];
    try {
      const res = await client.query<Caja[]>('SELECT * FROM public.BUSCAR_CAJAS($1)', params);
      const result: Caja[] = plainToClass(Caja, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al consultar Cajas: ' + err);
      throw new Error('Error al consultar Cajas.');
    } finally {
      client.release();
    }
  }

  async registrarCaja(caja: Caja): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [caja.nombre, caja.descripcion];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_CAJA($1, $2)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al registrar Caja: ' + err);
      throw new Error('Error al registrar Caja.');
    } finally {
      client.release();
    }
  }

  async modificarCaja(caja: Caja): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [caja.id, caja.nombre, caja.descripcion];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.MODIFICAR_CAJA($1, $2, $3)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al modificar la caja: ' + err);
      throw new Error('Error al modificar la caja.');
    } finally {
      client.release();
    }
  }

  async eliminarCaja(idCaja: number): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [idCaja];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.ELIMINAR_CAJA($1)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al eliminar la caja: ' + err);
      throw new Error('Error al eliminar la caja.');
    } finally {
      client.release();
    }
  }

  async obtenerArqueos(filtro: FiltrosArqueos): Promise<Arqueo[]> {
    const client = await PoolDb.connect();

    const params = [filtro.idArqueo || null, filtro.fechaApertura || null, filtro.estado || null];
    try {
      const res = await client.query<Arqueo[]>('SELECT * FROM public.BUSCAR_ARQUEOS($1, $2, $3)', params);
      const arqueos = res.rows.map((row: any) => {
        // Mapeo de objetos del arqueo (caja y estado)
        const caja: Caja = plainToClass(Caja, row, { excludeExtraneousValues: true });
        const estadoArqueo: EstadoArqueo = plainToClass(EstadoArqueo, row, { excludeExtraneousValues: true });
        const arqueo: Arqueo = plainToClass(Arqueo, row, { excludeExtraneousValues: true });
        const responsable: Usuario = plainToClass(Usuario, row, { excludeExtraneousValues: true });

        arqueo.caja = caja;
        arqueo.estadoArqueo = estadoArqueo;
        arqueo.responsable = responsable;

        return arqueo;
      });
      return arqueos;
    } catch (err) {
      logger.error('Error al consultar Arqueos: ' + err);
      throw new Error('Error al consultar Arqueos.');
    } finally {
      client.release();
    }
  }

  async registrarArqueo(arqueo: Arqueo): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [
      arqueo.fechaApertura,
      arqueo.horaApertura,
      arqueo.montoInicial,
      arqueo.horaCierre,
      arqueo.sistema,
      arqueo.usuario,
      arqueo.diferencia,
      arqueo.idEstadoArqueo,
      arqueo.idCaja,
      arqueo.responsable
    ];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_ARQUEO($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      console.log(result);
      return result;
    } catch (err) {
      logger.error('Error al registrar Arqueo: ' + err);
      throw new Error('Error al registrar Arqueo.');
    } finally {
      client.release();
    }
  }

  async modificarArqueo(arqueo: Arqueo): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [arqueo.id, arqueo.fechaApertura, arqueo.horaApertura, arqueo.montoInicial, arqueo.idCaja, arqueo.responsable];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.MODIFICAR_ARQUEO($1, $2, $3, $4, $5, $6)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al modificar el arqueo: ' + err);
      throw new Error('Error al modificar el arqueo.');
    } finally {
      client.release();
    }
  }

  async eliminarArqueo(idArqueo: number): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [idArqueo];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.ELIMINAR_ARQUEO($1)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al eliminar el arqueo: ' + err);
      throw new Error('Error al eliminar el arqueo.');
    } finally {
      client.release();
    }
  }

  async obtenerEstadosArqueo(): Promise<EstadoArqueo[]> {
    const client = await PoolDb.connect();
    try {
      const res = await client.query<EstadoArqueo[]>('SELECT * FROM PUBLIC.ESTADO_ARQUEO e WHERE e.activo = 1');
      const result: EstadoArqueo[] = plainToClass(EstadoArqueo, res.rows, {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al consultar Estados Arqueo: ' + err);
      throw new Error('Error al consultar Estados Arqueo.');
    } finally {
      client.release();
    }
  }

  async registrarMovimientoManual(movimiento: MovimientoManual): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [movimiento.idArqueo, movimiento.fechaMovimiento, movimiento.formaPago, movimiento.descripcion, movimiento.tipoMovimiento, movimiento.monto];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.REGISTRAR_MOVIMIENTO_MANUAL($1, $2, $3, $4, $5, $6)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al registrar Movimiento Manual de Arqueo: ' + err);
      throw new Error('Error al registrar Movimiento Manual de Arqueo.');
    } finally {
      client.release();
    }
  }

  async eliminarMovimientoManual(idMovimiento: number): Promise<SpResult> {
    const client = await PoolDb.connect();
    const params = [idMovimiento];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.ELIMINAR_MOVIMIENTO_MANUAL($1)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al eliminar el movimiento manual de arqueo: ' + err);
      throw new Error('Error al eliminar el movimiento manual de arqueo.');
    } finally {
      client.release();
    }
  }

  async obtenerMovimientosManuales(idArqueo: number): Promise<MovimientoManual[]> {
    const client = await PoolDb.connect();

    const params = [idArqueo];
    try {
      const res = await client.query<MovimientoManual[]>('SELECT * FROM public.BUSCAR_MOVIMIENTOS_MANUALES($1)', params);
      const movimientos: MovimientoManual[] = res.rows.map((row: any) => {
        // Mapeo de objetos del movimiento (forma de pago)
        const formaDePago: FormaDePago = plainToClass(FormaDePago, row, { excludeExtraneousValues: true });
        const movimiento: MovimientoManual = plainToClass(MovimientoManual, row, { excludeExtraneousValues: true });
        const tipoMovimiento: TipoMovimientoArqueo = plainToClass(TipoMovimientoArqueo, row, { excludeExtraneousValues: true });

        movimiento.formaPago = formaDePago;
        movimiento.tipoMovimientoArqueo = tipoMovimiento;

        return movimiento;
      });
      return movimientos;
    } catch (err) {
      logger.error('Error al consultar Movimientos: ' + err);
      throw new Error('Error al consultar Movimientos.');
    } finally {
      client.release();
    }
  }

  async cerrarArqueo(arqueo: Arqueo): Promise<SpResult> {
    const client = await PoolDb.connect();
    const horaUTC = new Date(arqueo.horaCierre);

    // Ajustar la hora y la fecha a la zona horaria de Argentina
    const horaArgentina = new Date(horaUTC.toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));

    // Verificar si la hora es pasada de medianoche
    if (horaArgentina.getHours() === 0 && horaArgentina.getMinutes() === 0 && horaArgentina.getSeconds() === 0) {
      // Ajustar a 23:59:59 del día anterior
      horaArgentina.setHours(23, 59, 59);
      horaArgentina.setDate(horaArgentina.getDate() - 1); // Ajustar la fecha al día anterior
    }

    // Formatear la hora en el formato hh:mm:ss
    const horaFormatoArgentina = `${horaArgentina.getHours().toString().padStart(2, '0')}:${horaArgentina.getMinutes().toString().padStart(2, '0')}:${horaArgentina
      .getSeconds()
      .toString()
      .padStart(2, '0')}`;

    const params = [
      arqueo.id,
      horaFormatoArgentina,
      arqueo.diferencia,
      arqueo.diferenciaOtros,
      arqueo.montoSistemaCaja,
      arqueo.montoSistemaOtros,
      arqueo.cantidadDineroCajaUsuario,
      arqueo.cantidadDineroOtrosUsuario
    ];
    try {
      const res = await client.query<SpResult>('SELECT * FROM PUBLIC.CERRAR_ARQUEO($1, $2, $3, $4, $5, $6, $7, $8)', params);
      const result: SpResult = plainToClass(SpResult, res.rows[0], {
        excludeExtraneousValues: true
      });
      return result;
    } catch (err) {
      logger.error('Error al cerrar el arqueo: ' + err);
      throw new Error('Error al cerrar el arqueo.');
    } finally {
      client.release();
    }
  }
}
