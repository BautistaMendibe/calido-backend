import { Expose } from 'class-transformer';

export class Localidad {
  @Expose({ name: 'idlocalidad' })
  id: number;
  @Expose({ name: 'nlocalidad' })
  nombre: string;
  @Expose({ name: 'codigopostal' })
  codigoPostal: string;
  @Expose({ name: 'idprovincia' })
  idProvincia: number;

  constructor(id?: number, nombre?: string, codigoPostal?: string, idProvincia?: number) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
    this.codigoPostal = codigoPostal ? codigoPostal : null;
    this.idProvincia = idProvincia ? idProvincia : null;
  }
}
