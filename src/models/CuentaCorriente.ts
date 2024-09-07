import { Expose } from 'class-transformer';
import { Usuario } from './Usuario';

export class CuentaCorriente {
  @Expose({ name: 'idcuentacorriente' })
  id: number;

  @Expose({ name: 'nombre' })
  nombre: string;

  @Expose({ name: 'apellido' })
  apellido: string;

  @Expose({ name: 'fechadesde' })
  fechaDesde: Date;

  @Expose({ name: 'fechahasta' })
  fechaHasta: Date;

  @Expose({ name: 'balancetotal' })
  balanceTotal: number;

  usuario: Usuario;

  constructor(id?: number, nombre?: string, apellido?: string, fechaDesde?: Date, fechaHasta?: Date, balanceTotal?: number) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
    this.apellido = apellido ? apellido : null;
    this.fechaDesde = fechaDesde ? fechaDesde : null;
    this.fechaHasta = fechaHasta ? fechaHasta : null;
    this.balanceTotal = balanceTotal ? balanceTotal : null;
  }
}
