import { SpResult } from '../../models';
import { Venta } from '../../models/Venta';
import { Producto } from '../../models/Producto';
import { Usuario } from '../../models/Usuario';
import { FormaDePago } from '../../models/FormaDePago';
import { PoolClient } from 'pg';
import { CondicionIva } from '../../models/CondicionIva';
import { TipoFactura } from '../../models/TipoFactura';
import { ComprobanteResponse } from '../../models/ComprobanteResponse';

export interface IVentasService {
  registrarVenta(venta: Venta, client: PoolClient): Promise<SpResult>;
  registrarDetalleVenta(producto: Producto, idVenta: number, client: PoolClient): Promise<SpResult>;
  buscarUsuariosClientes(): Promise<Usuario[]>;
  buscarFormasDePago(): Promise<FormaDePago[]>;
  obtenerCondicionesIva(): Promise<CondicionIva[]>;
  obtenerTipoFacturacion(): Promise<TipoFactura[]>;
  facturarVentaConAfip(venta: Venta): Promise<ComprobanteResponse>;
}
