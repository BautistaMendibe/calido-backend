import { Marca } from '../../models/Marca';

export interface IMarcaService {
  obtenerMarcas(): Promise<Marca[]>;
}
