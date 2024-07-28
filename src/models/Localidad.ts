import { Expose } from 'class-transformer';
import { Provincia } from './Provincia';

export class Localidad {
  @Expose({ name: 'idlocalidad' })
  id: number;
  @Expose({ name: 'nlocalidad' })
  nombre: string;
  @Expose({ name: 'codigopostal' })
  codigoPostal: string;

  provincia: Provincia;

  constructor(id?: number, nombre?: string, codigoPostal?: string, provincia?: Provincia) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
    this.codigoPostal = codigoPostal ? codigoPostal : null;
    this.provincia = provincia ? provincia : null;
  }
}
