import { Expose } from 'class-transformer';

export class Cuota {
  @Expose({ name: 'idcuota' })
  id: number;
  @Expose({ name: 'ncuota' })
  nombre: string;
  @Expose({ name: 'cantcuotas' })
  cantidadCuotas: number;

  constructor(id?: number, nombre?: string, cantidadCuotas?: number) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
    this.cantidadCuotas = cantidadCuotas ? cantidadCuotas : null;
  }
}
