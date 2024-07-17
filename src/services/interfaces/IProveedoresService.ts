import { Proveedor } from '../../models/Proveedor';
import { SpResult } from '../../models';
import { FiltrosProveedores } from '../../models/comandos/FiltroProveedores';
import { TipoProveedor } from '../../models/TipoProveedor';

export interface IProveedoresService {
  registrarProveedor(proveedor: Proveedor): Promise<SpResult>;
  consultarProveedores(filtro: FiltrosProveedores): Promise<Proveedor[]>;
  modificarProveedor(proveedor: Proveedor): Promise<SpResult>;
  eliminarProveedor(idProveedor: number): Promise<SpResult>;
  buscarTiposProveedores(): Promise<TipoProveedor[]>;
  buscarTipoProveedor(id: number): Promise<TipoProveedor>;
}
