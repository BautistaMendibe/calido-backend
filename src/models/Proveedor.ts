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
  @Expose({ name: 'idDomicilio' })
  idDomicilio: number;
  @Expose({ name: 'cuit' })
  cuit: string;
  @Expose({ name: 'idtipoproveedor' })
  idTipoProveedor: number;

  domicilio: Domicilio;
  tipoProveedor: TipoProveedor;

  constructor(
    id?: number,
    nombre?: string,
    telefono?: string,
    email?: string,
    idDomicilio?: number,
    cuit?: string,
    idTipoProveedor?: number,
    tipoProveedor?: TipoProveedor,
    domicilio?: Domicilio
  ) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
    this.telefono = telefono ? telefono : null;
    this.email = email ? email : null;
    this.idDomicilio = idDomicilio ? idDomicilio : null;
    this.cuit = cuit ? cuit : null;
    this.idTipoProveedor = idTipoProveedor ? idTipoProveedor : null;
    this.tipoProveedor = tipoProveedor ? tipoProveedor : null;
    this.domicilio = domicilio ? domicilio : null;
  }
}
