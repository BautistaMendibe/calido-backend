import { Proveedor } from '../../models/Proveedor';
import { SpResult } from '../../models';

export interface IProveedoresService {
  registrarProveedor(proveedor: Proveedor): Promise<SpResult>;
}
