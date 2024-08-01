import { Configuracion } from '../../models/Configuracion';
import { SpResult } from '../../models';

export interface IConfiguracionesService {
  obtenerConfiguraciones(): Promise<Configuracion>;
  registrarConfiguracion(configuracion: Configuracion): Promise<SpResult>;
  modificarConfiguracion(configuracion: Configuracion): Promise<SpResult>;
}
