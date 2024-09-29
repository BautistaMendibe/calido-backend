import { Producto } from './Producto';
import { Expose } from 'class-transformer';
import { Proveedor } from './Proveedor';

export class DetalleProducto {
  @Expose({ name: 'iddetalleproducto' })
  id: number;
  @Expose({ name: 'canteninventario' })
  cantEnInventario: number;
  @Expose({ name: 'idproducto' })
  idProducto: number;

  producto: Producto;
  proveedor: Proveedor;

  constructor(id?: number, cantEnInventario?: number, idProducto?: number, producto?: Producto, proveedor?: Proveedor) {
    this.id = id!;
    this.cantEnInventario = cantEnInventario!;
    this.idProducto = idProducto!;
    this.producto = producto!;
    this.proveedor = proveedor!;
  }
}
