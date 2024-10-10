import { Expose } from 'class-transformer';
import { Producto } from './Producto';

export class Promocion {
  @Expose({ name: 'idpromocionproducto' })
  id: number;
  @Expose({ name: 'npromocionproducto' })
  nombre: string;
  @Expose({ name: 'percentdescuento' })
  porcentajeDescuento: string;
  @Expose({ name: 'iddetallepromocion' })
  idDetallePromocion: number;

  productos: Producto[];

  constructor(id?: number, nombre?: string, porcentajeDescuento?: string, idDetallePromocion?: number, productos?: Producto[]) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
    this.porcentajeDescuento = porcentajeDescuento ? porcentajeDescuento : null;
    this.idDetallePromocion = idDetallePromocion ? idDetallePromocion : null;
    this.productos = productos ? productos : [];
  }
}
