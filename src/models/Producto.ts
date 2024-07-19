import { Expose } from 'class-transformer';

export class Producto {
  @Expose({ name: 'idproducto' })
  id: number;
  @Expose({ name: 'nproducto' })
  nombre: string;
  @Expose({ name: 'preciocosto' })
  precioCosto: number;
  @Expose({ name: 'preciocostoiva' })
  precioCostoIva: number;
  @Expose({ name: 'idmarca' })
  idMarca: number;

  constructor(id?: number, nombre?: string, precioCosto?: number, precioCostoIva?: number, idMarca?: number) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
    this.precioCosto = precioCosto ? precioCosto : null;
    this.precioCostoIva = precioCostoIva ? precioCostoIva : null;
    this.idMarca = idMarca ? idMarca : null;
  }
}
