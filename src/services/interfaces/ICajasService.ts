import { Caja } from '../../models/Caja';
import { SpResult } from '../../models';
import { FiltrosCajas } from '../../models/comandos/FiltroCaja';
import { FiltrosArqueos } from '../../models/comandos/FiltroArqueo';
import { Arqueo } from '../../models/Arqueo';
import { EstadoArqueo } from '../../models/EstadoArqueo';

export interface ICajasService {
  consultarCajas(filtro: FiltrosCajas): Promise<Caja[]>;
  registrarCaja(caja: Caja): Promise<SpResult>;
  modificarCaja(caja: Caja): Promise<SpResult>;
  eliminarCaja(idCaja: number): Promise<SpResult>;
  consultarArqueos(filtro: FiltrosArqueos): Promise<Arqueo[]>;
  registrarArqueo(arqueo: Arqueo): Promise<SpResult>;
  modificarArqueo(arqueo: Arqueo): Promise<SpResult>;
  eliminarArqueo(idArqueo: number): Promise<SpResult>;
  obtenerEstadosArqueo(): Promise<EstadoArqueo[]>;
}
