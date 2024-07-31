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

  localidad: Localidad;

  constructor(id?: number, calle?: string, numero?: number, localidad?: Localidad) {
    this.id = id!;
    this.calle = calle!;
    this.numero = numero!;
    this.localidad = localidad!;
  }
}
