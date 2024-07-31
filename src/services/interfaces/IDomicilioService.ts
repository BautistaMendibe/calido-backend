import { Provincia } from '../../models/Provincia';
import { Localidad } from '../../models/Localidad';

export interface IDomicilioService {
  obtenerProvincias(): Promise<Provincia[]>;
  obtenerLocalidadesPorProvincia(idProvincia: number): Promise<Localidad[]>;
}
