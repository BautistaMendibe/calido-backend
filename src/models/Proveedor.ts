import { Expose } from 'class-transformer';

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

  constructor(id?: number, nombre?: string, telefono?: string, email?: string, idDomicilio?: number, cuit?: string) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
    this.telefono = telefono ? telefono : null;
    this.email = email ? email : null;
    this.idDomicilio = idDomicilio ? idDomicilio : null;
    this.cuit = cuit ? cuit : null;
  }
}
