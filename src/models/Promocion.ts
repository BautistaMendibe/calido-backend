import { Expose } from 'class-transformer';
import { Producto } from './Producto';

export class Promocion {
  @Expose({ name: 'idpromocionproducto' })
  id: number;
  @Expose({ name: 'npromocionproducto' })
  nombre: string;
  @Expose({ name: 'percentdescuento' })
  porcentajeDescuento: number;

  productos: Producto[];
  productosEliminados: Producto[];

  @Expose({ name: 'fechahasta' })
  fechaHasta: Date | null;

  constructor(id?: number, nombre?: string, porcentajeDescuento?: number, productos?: Producto[], productosEliminados?: Producto[], fechaHasta?: Date) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
    this.porcentajeDescuento = porcentajeDescuento ? porcentajeDescuento : null;
    this.productos = productos ? productos : [];
    this.productosEliminados = productosEliminados ? productosEliminados : [];
    this.fechaHasta = fechaHasta ? fechaHasta : null;
  }
}
