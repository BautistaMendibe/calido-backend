import { Request, Response } from 'express';
import { logger } from '../logger/CustomLogger';
import { HttpCodes, SpResult } from '../models';
import container from '../services/inversify.config';
import { TYPES } from '../services/types/types';
import { VentasService } from '../services/implementations/VentasService';
import { Venta } from '../models/Venta';
import { Usuario } from '../models/Usuario';
import { FormaDePago } from '../models/FormaDePago';
import { TipoFactura } from '../models/TipoFactura';
import { CondicionIva } from '../models/CondicionIva';
import { ComprobanteResponse } from '../models/ComprobanteResponse';
import { FiltrosVentas } from '../models/comandos/FiltroVentas';
import { VentasMensuales } from '../models/comandos/VentasMensuales';
import { VentasDiariaComando } from '../models/comandos/VentasDiariaComando';
import { FiltrosMovimientosCuentaCorriente } from '../models/comandos/FiltroMovimientoCuentaCorriente';
import { MovimientoCuentaCorriente } from '../models/MovimientoCuentaCorriente';
import { FiltrosDetallesVenta } from '../models/comandos/FiltroDetalleVenta';
import { DetalleVenta } from '../models/DetalleVenta';

const _ventasService = container.get<VentasService>(TYPES.VentasService);

export async function registrarVentaConDetalles(request: Request, response: Response): Promise<Response> {
  const venta: Venta = request.body;

  return _ventasService
    .registrarVentaConDetalles(venta)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function buscarUsuariosClientes(request: Request, response: Response): Promise<Response> {
  return _ventasService
    .buscarUsuariosClientes()
    .then((x: Usuario[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function buscarFormasDePago(request: Request, response: Response): Promise<Response> {
  return _ventasService
    .buscarFormasDePago()
    .then((x: FormaDePago[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function obtenerCondicionesIva(request: Request, response: Response): Promise<Response> {
  return _ventasService
    .obtenerCondicionesIva()
    .then((x: CondicionIva[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function obtenerTipoFacturacion(request: Request, response: Response): Promise<Response> {
  //const idCondicionIva = +request.params.idCondicionIva;

  return _ventasService
    .obtenerTipoFacturacion()
    .then((x: TipoFactura[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function facturarVentaConAfip(request: Request, response: Response): Promise<Response> {
  const venta: Venta = request.body;

  return _ventasService
    .facturarVentaConAfip(venta)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function buscarVentas(request: Request, response: Response): Promise<Response> {
  const filtros: FiltrosVentas = request.body;

  return _ventasService
    .buscarVentas(filtros)
    .then((x: Venta[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function buscarVentasPaginadas(request: Request, response: Response): Promise<Response> {
  const filtros: FiltrosVentas = request.body;

  return _ventasService
    .buscarVentasPaginadas(filtros)
    .then((x: Venta[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function buscarVentasPorCC(request: Request, response: Response): Promise<Response> {
  const idUsuario = +request.params.idUsuario;

  return _ventasService
    .buscarVentasPorCC(idUsuario)
    .then((x: Venta[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function buscarVentasConFechaHora(request: Request, response: Response): Promise<Response> {
  const fechaHora: string = request.body.fechaHora;
  const fechaHoraCierre: string = request.body.fechaHoraCierre;

  return _ventasService
    .buscarVentasConFechaHora(fechaHora, fechaHoraCierre)
    .then((x: Venta[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function anularVenta(request: Request, response: Response): Promise<Response> {
  const venta: Venta = request.body;

  return _ventasService
    .anularVenta(venta)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function anularVentaSinFacturacion(request: Request, response: Response): Promise<Response> {
  const venta: Venta = request.body;

  return _ventasService
    .anularVentaSinFacturacion(venta)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function buscarCantidadVentasMensuales(request: Request, response: Response): Promise<Response> {
  return _ventasService
    .buscarCantidadVentasMensuales()
    .then((x: VentasMensuales[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function buscarVentasPorDiaYHora(request: Request, response: Response): Promise<Response> {
  return _ventasService
    .buscarVentasPorDiaYHora()
    .then((x: VentasDiariaComando[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function pagarConQRSIRO(request: Request, response: Response): Promise<Response> {
  const venta: Venta = request.body;

  return _ventasService
    .pagarConSIROQR(venta)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function pagarConQRSIROPagosDeCuentaCorriente(request: Request, response: Response): Promise<Response> {
  const movimiento: MovimientoCuentaCorriente = request.body;

  return _ventasService
    .pagarConSIROQRPagosDeCuentaCorriente(movimiento)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function consultaPagoSIROQR(request: Request, response: Response): Promise<Response> {
  return _ventasService
    .consultaPagoSIROQR(request.body.IdReferenciaOperacion)
    .then((x: SpResult) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export async function buscarDetallesVenta(request: Request, response: Response): Promise<Response> {
  const filtros: FiltrosDetallesVenta = request.body;

  return _ventasService
    .consultarDetallesVenta(filtros)
    .then((x: DetalleVenta[]) => {
      return response.status(HttpCodes.OK).json(x);
    })
    .catch((error) => {
      logger.error(error);
      return response.status(HttpCodes.CONFLICT).json(error.message);
    });
}

export const VentasController = {
  registrarVentaConDetalles,
  buscarUsuariosClientes,
  buscarFormasDePago,
  obtenerCondicionesIva,
  obtenerTipoFacturacion,
  facturarVentaConAfip,
  buscarVentas,
  buscarVentasPaginadas,
  buscarVentasPorCC,
  anularVenta,
  anularVentaSinFacturacion,
  buscarVentasConFechaHora,
  buscarCantidadVentasMensuales,
  buscarVentasPorDiaYHora,
  pagarConQRSIRO,
  consultaPagoSIROQR,
  buscarDetallesVenta,
  pagarConQRSIROPagosDeCuentaCorriente
};
