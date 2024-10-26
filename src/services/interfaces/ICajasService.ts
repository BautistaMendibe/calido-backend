import { Caja } from '../../models/Caja';
import { SpResult } from '../../models';
import { FiltrosCajas } from '../../models/comandos/FiltroCaja';

export interface ICajasService {
  consultarCajas(filtro: FiltrosCajas): Promise<Caja[]>;
  registrarCaja(caja: Caja): Promise<SpResult>;
  modificarCaja(caja: Caja): Promise<SpResult>;
  eliminarCaja(idCaja: number): Promise<SpResult>;
}
