import { Expose, Transform } from 'class-transformer';
import { Usuario } from './Usuario';
import { FormaDePago } from './FormaDePago';
import { Producto } from './Producto';
import { TipoFactura } from './TipoFactura';
import { ComprobanteResponse } from './ComprobanteResponse';

export class Venta {
  @Expose({ name: 'idventa' })
  id: number;
  @Expose({ name: 'montototal' })
  montoTotal: number;
  @Expose({ name: 'fechaventa' })
  fecha: Date;
  fechaString: string;
  fechaVencimiento: Date;
  @Expose({ name: 'idusuario' })
  cliente: Usuario;
  formaDePago: FormaDePago;
  productos: Producto[];
  facturacion: TipoFactura;
  comprobanteAfip: ComprobanteResponse;
  @Expose({ name: 'idempleado' })
  idEmpleado: number;

  @Expose({ name: 'tarjeta' })
  tarjeta: string;
  @Expose({ name: 'cantcuotas' })
  cantidadCuotas: number;
  @Expose({ name: 'interes' })
  interes: number;
  @Expose({ name: 'anulada' })
  @Transform((value) => value == 1)
  anulada: boolean;
  @Expose({ name: 'idcaja' })
  idCaja: number;
  notaCredito: string;
  @Expose({ name: 'fechafacturacion' })
  fechaFacturacion: Date;
  @Expose({ name: 'fechaanulacion' })
  fechaAnulacion: Date;
  @Expose({ name: 'bonificacion' })
  bonificacion: number;
  productosSeleccionadoParaAnular: Producto[];
  totalAnulado: number;

  @Expose({ name: 'totaldeventas' })
  totalDeVentas: number;

  @Expose({ name: 'ultimos4DigitosTarjeta' })
  ultimosCuatroDigitosTarjeta: string;

  constructor(
    id?: number,
    montoTotal?: number,
    fecha?: Date,
    cliente?: Usuario,
    formaDePago?: FormaDePago,
    fechaVencimiento?: Date,
    productos?: Producto[],
    facturacion?: TipoFactura,
    fechaString?: string,
    comprobanteAfip?: ComprobanteResponse,
    idEmpleado?: number,
    tarjeta?: string,
    cantidadCuotas?: number,
    interes?: number,
    anulada?: boolean,
    idCaja?: number,
    notaCredito?: string,
    fechaFacturacion?: Date,
    fechaAnulacion?: Date,
    bonificacion?: number,
    productosSeleccionadoParaAnular?: Producto[],
    totalAnulado?: number,
    totalDeVentas?: number,
    ultimosCuatroDigitosTarjeta?: string
  ) {
    this.id = id!;
    this.montoTotal = montoTotal!;
    this.fecha = fecha!;
    this.cliente = cliente!;
    this.formaDePago = formaDePago!;
    this.productos = productos!;
    this.facturacion = facturacion!;
    this.fechaVencimiento = fechaVencimiento!;
    this.fechaString = fechaString!;
    this.comprobanteAfip = comprobanteAfip!;
    this.idEmpleado = idEmpleado!;
    this.tarjeta = tarjeta!;
    this.cantidadCuotas = cantidadCuotas!;
    this.interes = interes!;
    this.anulada = anulada!;
    this.idCaja = idCaja!;
    this.notaCredito = notaCredito!;
    this.fechaFacturacion = fechaFacturacion!;
    this.fechaAnulacion = fechaAnulacion!;
    this.bonificacion = bonificacion!;
    this.productosSeleccionadoParaAnular = productosSeleccionadoParaAnular!;
    this.totalAnulado = totalAnulado!;
    this.totalDeVentas = totalDeVentas!;
    this.ultimosCuatroDigitosTarjeta = ultimosCuatroDigitosTarjeta!;
  }
}
