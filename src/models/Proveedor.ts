import { Expose } from 'class-transformer';
import { TipoProveedor } from './TipoProveedor';
import { Domicilio } from './Domicilio';

export class Proveedor {
  @Expose({ name: 'idproveedor' })
  id: number;

  @Expose({ name: 'nproveedor' })
  nombre: string;

  @Expose({ name: 'telefono' })
  telefono: string;

  @Expose({ name: 'email' })
  email: string;

  @Expose({ name: 'cuit' })
  cuit: string;

  domicilio: Domicilio;
  tipoProveedor: TipoProveedor;

  constructor(id?: number, nombre?: string, telefono?: string, email?: string, cuit?: string, tipoProveedor?: TipoProveedor) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
    this.telefono = telefono ? telefono : null;
    this.email = email ? email : null;
    this.cuit = cuit ? cuit : null;
    this.tipoProveedor = tipoProveedor ? tipoProveedor : null;
  }
}
