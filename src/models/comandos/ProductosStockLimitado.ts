import { Expose } from 'class-transformer';

export class ProductoStockLimitadoComando {
  @Expose({ name: 'idproducto' })
  id: number;
  @Expose({ name: 'nproducto' })
  nombre: string;
  @Expose({ name: 'nproveedor' })
  proveedor: string;
  @Expose({ name: 'canteninventario' })
  cantidadEnStock: number;
  @Expose({ name: 'codigobarra' })
  codigoBarra: string;
  @Expose({ name: 'imgproducto' })
  imgProducto: string;

  constructor(id?: number, nombre?: string, proveedor?: string, cantidadEnStock?: number, codigoBarra?: string, imgProducto?: string) {
    this.id = id!;
    this.nombre = nombre!;
    this.proveedor = proveedor!;
    this.codigoBarra = codigoBarra!;
    this.imgProducto = imgProducto!;
    this.cantidadEnStock = cantidadEnStock!;
  }
}
