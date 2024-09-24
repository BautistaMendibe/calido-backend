import { Usuario } from './Usuario';
import { Expose } from 'class-transformer';
import { TipoComprobante } from './TipoComprobante';
import { DetalleComprobante } from './DetalleComprobante';

export class Comprobante {
  @Expose({ name: 'idcomprobante' })
  id: number;
  @Expose({ name: 'numerocomprobante' })
  numerocomprobante: number;
  @Expose({ name: 'fechaemision' })
  fechaEmision: Date;
  @Expose({ name: 'idproveedor' })
  idProveedor: number;
  @Expose({ name: 'observaciones' })
  observaciones: string;
  @Expose({ name: 'montototalcomp' })
  total: number;
  @Expose({ name: 'idusuarioresponsable' })
  idResponsable: number;
  @Expose({ name: 'idusuarioreceptor' })
  idReceptor: number;
  @Expose({ name: 'idtipocomprobante' })
  idTipoComprobante: number;

  detalleComprobante: DetalleComprobante[];
  responsable: Usuario;
  receptor: Usuario;
  tipoComprobante: TipoComprobante;

  constructor(
    id?: number,
    numerocomprobante?: number,
    fechaEmision?: Date,
    idProveedor?: number,
    observaciones?: string,
    total?: number,
    idResponsable?: number,
    idReceptor?: number,
    detalleComprobante?: DetalleComprobante[],
    responsable?: Usuario,
    receptor?: Usuario,
    idTipoComprobante?: number,
    tipoComprobante?: TipoComprobante
  ) {
    this.id = id!;
    this.numerocomprobante = numerocomprobante!;
    this.fechaEmision = fechaEmision!;
    this.idProveedor = idProveedor!;
    this.observaciones = observaciones!;
    this.total = total!;
    this.idResponsable = idResponsable!;
    this.idReceptor = idReceptor!;
    this.detalleComprobante = detalleComprobante!;
    this.responsable = responsable!;
    this.receptor = receptor!;
    this.idTipoComprobante = idTipoComprobante!;
    this.tipoComprobante = tipoComprobante!;
  }
}
