import { SpResult } from '../../models';
import { Tarjeta } from '../../models/Tarjeta';
import { FiltrosTarjetas } from '../../models/comandos/FiltroTarjetas';
import { TipoTarjeta } from '../../models/TipoTarjeta';

export interface ITarjetasService {
  registrarTarjeta(tarjeta: Tarjeta): Promise<SpResult>;
  consultarTarjetas(filtro: FiltrosTarjetas): Promise<Tarjeta[]>;
  eliminarTarjeta(idTarjeta: number): Promise<SpResult>;
  buscarTiposTarjetas(): Promise<TipoTarjeta[]>;
  modificarTarjeta(tarjeta: Tarjeta): Promise<SpResult>;
}
