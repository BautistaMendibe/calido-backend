import { Expose, Type } from 'class-transformer';
import { TipoProducto } from './TipoProducto';
import { Marca } from './Marca';
import { Proveedor } from './Proveedor';

export class Producto {
  @Expose({ name: 'idproducto' })
  id: number;

  @Expose({ name: 'nproducto' })
  nombre: string;

  @Expose({ name: 'preciocosto' })
  costo: number;

  @Expose({ name: 'preciocostoiva' })
  costoIva: number;

  tipoProducto: TipoProducto;
  marca: Marca;
  proveedor: Proveedor;

  constructor(id?: number, nombre?: string, costo?: number, costoIva?: number, tipoProducto?: TipoProducto, marca?: Marca, proveedor?: Proveedor) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
    this.costo = costo ? costo : null;
    this.costoIva = costoIva ? costoIva : null;
    this.tipoProducto = tipoProducto ? tipoProducto : null;
    this.marca = marca ? marca : null;
    this.proveedor = proveedor ? proveedor : null;
  }
}
