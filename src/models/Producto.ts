import { Expose, Type } from 'class-transformer';
import { Proveedor } from './Proveedor';
import { TipoProducto } from './TipoProducto';
import { Marca } from './Marca';

export class Producto {
  @Expose({ name: 'idproducto' })
  id: number;

  @Expose({ name: 'nproducto' })
  nombre: string;

  @Expose({ name: 'preciocosto' })
  costo: number;

  @Expose({ name: 'preciocostoiva' })
  costoIva: number;

  @Expose({ name: 'idTipoProducto' })
  @Type(() => TipoProducto)
  tipoProducto: TipoProducto;

  @Expose({ name: 'idProveedor' })
  @Type(() => Proveedor)
  proveedor: Proveedor;

  @Expose({ name: 'idMarca' })
  @Type(() => Marca)
  marca: Marca;

  constructor(id?: number, nombre?: string, costo?: number, costoIva?: number, tipoProducto?: TipoProducto, proveedor?: Proveedor, marca?: Marca) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
    this.costo = costo ? costo : null;
    this.costoIva = costoIva ? costoIva : null;
    this.tipoProducto = tipoProducto ? tipoProducto : null;
    this.proveedor = proveedor ? proveedor : null;
    this.marca = marca ? marca : null;
  }
}
