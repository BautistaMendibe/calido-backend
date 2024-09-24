import { SpResult } from '../../models';
import { Comprobante } from '../../models/Comprobante';
import { FiltrosComprobantes } from '../../models/comandos/FiltroComprobantes';
import { TipoComprobante } from '../../models/TipoComprobante';

export interface IComprobantesService {
  registrarComprobante(comprobante: Comprobante): Promise<SpResult>;
  consultarComprobantes(filtro: FiltrosComprobantes): Promise<Comprobante[]>;
  eliminarComprobante(idComprobante: number): Promise<SpResult>;
  obtenerTiposComprobantes(): Promise<TipoComprobante[]>;
  modificarComprobante(comprobante: Comprobante): Promise<SpResult>;
}
