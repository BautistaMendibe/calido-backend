import { Provincia } from './Provincia';
import { Expose } from 'class-transformer';
import { Localidad } from './Localidad';

export class Domicilio {
  @Expose({ name: 'iddomicilio' })
  id: number;
  @Expose({ name: 'calle' })
  calle: string;
  @Expose({ name: 'numero' })
  numero: number;
  @Expose({ name: 'idprovincia' })
  provinciaId: number;
  @Expose({ name: 'idlocalidad' })
  localidadId: number;

  localidad: Localidad;
  provincia: Provincia;

  constructor(id?: number, calle?: string, numero?: number, provincia?: Provincia, localidad?: Localidad) {
    this.id = id!;
    this.calle = calle!;
    this.numero = numero!;
    this.provincia = provincia!;
    this.localidad = localidad!;
  }
}
