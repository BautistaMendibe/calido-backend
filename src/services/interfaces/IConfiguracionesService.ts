import { Configuracion } from '../../models/Configuracion';
import { SpResult } from '../../models';

export interface IConfiguracionesService {
  obtenerConfiguraciones(): Promise<Configuracion>;
  registrarConfiguracion(): Promise<SpResult>;
  modificarConfiguracion(configuracion: Configuracion): Promise<SpResult>;
  existeConfiguracion(): Promise<boolean>;
  obtenerSuperusuario(): Promise<string>;
}
