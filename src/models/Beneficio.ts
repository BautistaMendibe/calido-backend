import { Expose, Transform } from 'class-transformer';

export class Beneficio {
  @Expose({ name: 'Id' })
  idSolicitud: number;
  @Transform((value: string) => value?.trimEnd())
  @Expose({ name: 'NroBeneficio' })
  nroBeneficio: string;
  @Transform((value: string) => value?.trimEnd())
  @Expose({ name: 'Prestacion' })
  prestacion: string;

  constructor(idSolicitud?: number, nroBeneficio?: string, prestacion?: string) {
    this.idSolicitud = idSolicitud;
    this.nroBeneficio = nroBeneficio;
    this.prestacion = prestacion;
  }
}
