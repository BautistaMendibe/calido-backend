import { Expose } from 'class-transformer';
export class Producto {
  @Expose({ name: 'idproducto' })
  id: number;
  @Expose({ name: 'nproducto' })
  nombre: string;
  @Expose({ name: 'preciocosto' })
  costo: number;
  @Expose({ name: 'preciocostoiva' })
  costoIva: number;
  @Expose({ name: 'idtipoproducto' })
  idTipoProducto: number;
  @Expose({ name: 'idproveedor' })
  idProveedor: number;
  @Expose({ name: 'idmarca' })
  idMarca: number;

  constructor(id?: number, nombre?: string, costo?: number, costoIva?: number, idTipoProducto?: number, idProveedor?: number, idMarca?: number) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
    this.costo = costo ? costo : null;
    this.costoIva = costoIva ? costoIva : null;
    this.idTipoProducto = idTipoProducto ? idTipoProducto : null;
    this.idProveedor = idProveedor ? idProveedor : null;
    this.idMarca = idMarca ? idMarca : null;
  }
}
