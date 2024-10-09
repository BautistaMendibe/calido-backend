import { Expose } from 'class-transformer';
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
  @Expose({ name: 'preciosiniva' })
  precioSinIVA: number;
  @Expose({ name: 'imgproducto' })
  imgProducto: string;
  @Expose({ name: 'codigobarra' })
  codigoBarra: string;
  @Expose({ name: 'descripcion' })
  descripcion: string;
  @Expose({ name: 'margenganancia' })
  margenGanancia: number;

  @Expose({ name: 'subtotalventa' })
  subTotalVenta: number;

  tipoProducto: TipoProducto;
  marca: Marca;
  proveedor: Proveedor;

  @Expose({ name: 'canteninventario' })
  cantidadEnStock: number;

  @Expose({ name: 'cantidad' })
  cantidadSeleccionada: number;

  constructor(
    id?: number,
    nombre?: string,
    costo?: number,
    precioSinIVA?: number,
    imgProducto?: string,
    codigoBarra?: string,
    descripcion?: string,
    tipoProducto?: TipoProducto,
    marca?: Marca,
    proveedor?: Proveedor,
    cantidadEnStock?: number,
    cantidadSeleccionada?: number,
    margenGanancia?: number,
    subTotalVenta?: number
  ) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
    this.costo = costo ? costo : null;
    this.precioSinIVA = precioSinIVA ? precioSinIVA : null;
    this.tipoProducto = tipoProducto ? tipoProducto : null;
    this.marca = marca ? marca : null;
    this.proveedor = proveedor ? proveedor : null;
    this.codigoBarra = codigoBarra ? codigoBarra : null;
    this.descripcion = descripcion ? descripcion : null;
    this.imgProducto = imgProducto ? imgProducto : null;
    this.cantidadEnStock = cantidadEnStock ? cantidadEnStock : null;
    this.cantidadSeleccionada = cantidadSeleccionada ? cantidadSeleccionada : null;
    this.subTotalVenta = subTotalVenta ? subTotalVenta : null;
    this.margenGanancia = margenGanancia ? margenGanancia : null;
  }
}
