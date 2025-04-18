import { Expose } from 'class-transformer';
import { Caja } from './Caja';
import { EstadoArqueo } from './EstadoArqueo';
import { Usuario } from './Usuario';

export class Arqueo {
  @Expose({ name: 'idarqueo' })
  id: number;
  @Expose({ name: 'fecha_apertura' })
  fechaApertura: Date;
  @Expose({ name: 'hora_apertura' })
  horaApertura: Date;
  @Expose({ name: 'monto_inicial' })
  montoInicial: number;
  @Expose({ name: 'hora_cierre' })
  horaCierre: Date;
  @Expose({ name: 'sistema' })
  sistema: number;
  @Expose({ name: 'usuario' })
  usuario: number;
  @Expose({ name: 'diferencia' })
  diferencia: number;
  @Expose({ name: 'idestadoarqueo' })
  idEstadoArqueo: number;
  @Expose({ name: 'idcaja' })
  idCaja: number;

  estadoArqueo: EstadoArqueo;
  caja: Caja;

  @Expose({ name: 'montosistemacaja' })
  montoSistemaCaja: number;
  @Expose({ name: 'montosistemaotros' })
  montoSistemaOtros: number;
  @Expose({ name: 'diferenciaotros' })
  diferenciaOtros: number;
  @Expose({ name: 'cantidaddinerocajausuario' })
  cantidadDineroCajaUsuario: number;
  @Expose({ name: 'cantidaddinerootrosusuario' })
  cantidadDineroOtrosUsuario: number;

  responsable: Usuario;

  constructor(
    id?: number,
    fechaApertura?: Date,
    horaApertura?: Date,
    montoInicial?: number,
    horaCierre?: Date,
    sistema?: number,
    usuario?: number,
    diferencia?: number,
    idEstadoArqueo?: number,
    idCaja?: number,
    estadoArqueo?: EstadoArqueo,
    caja?: Caja,
    montoSistemaCaja?: number,
    montoSistemaOtros?: number,
    diferenciaOtros?: number,
    cantidadDineroCajaUsuario?: number,
    cantidadDineroOtrosUsuario?: number,
    responsable?: Usuario
  ) {
    this.id = id ? id : null;
    this.fechaApertura = fechaApertura ? fechaApertura : null;
    this.horaApertura = horaApertura ? horaApertura : null;
    this.montoInicial = montoInicial ? montoInicial : null;
    this.horaCierre = horaCierre ? horaCierre : null;
    this.sistema = sistema ? sistema : null;
    this.usuario = usuario ? usuario : null;
    this.diferencia = diferencia ? diferencia : null;
    this.idEstadoArqueo = idEstadoArqueo ? idEstadoArqueo : null;
    this.idCaja = idCaja ? idCaja : null;
    this.estadoArqueo = estadoArqueo ? estadoArqueo : null;
    this.caja = caja ? caja : null;
    this.montoSistemaCaja = montoSistemaCaja ? montoSistemaCaja : null;
    this.montoSistemaOtros = montoSistemaOtros ? montoSistemaOtros : null;
    this.diferenciaOtros = diferenciaOtros ? diferenciaOtros : null;
    this.cantidadDineroCajaUsuario = cantidadDineroCajaUsuario ? cantidadDineroCajaUsuario : null;
    this.cantidadDineroOtrosUsuario = cantidadDineroOtrosUsuario ? cantidadDineroOtrosUsuario : null;
    this.responsable = responsable ? responsable : null;
  }
}
