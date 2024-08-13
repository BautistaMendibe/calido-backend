import { Expose } from 'class-transformer';
import { Usuario } from './Usuario';

export class Configuracion {
  @Expose({ name: 'idconfiguracion' })
  id: number;
  @Expose({ name: 'idusuario' })
  idUsuario: number;
  @Expose({ name: 'razon_social' })
  razonSocial: string;
  @Expose({ name: 'domicilio_comercial' })
  domicilioComercial: string;
  @Expose({ name: 'cuit' })
  cuit: string;
  @Expose({ name: 'fecha_inicio_actividades' })
  fechaInicioActividades: string;
  @Expose({ name: 'condicion_iva' })
  condicionIva: string;
  @Expose({ name: 'logo' })
  logo: string;
  @Expose({ name: 'contrasena_ig' })
  contrasenaInstagram: string;
  @Expose({ name: 'usuario_ig' })
  usuarioInstagram: string;

  usuario: Usuario;

  constructor(
    id?: number,
    idUsuario?: number,
    razonSocial?: string,
    domicilioComercial?: string,
    cuit?: string,
    fechaInicioActividades?: string,
    condicionIva?: string,
    logo?: string,
    contrasenaInstagram?: string,
    usuarioInstagram?: string
  ) {
    this.id = id!;
    this.idUsuario = idUsuario!;
    this.razonSocial = razonSocial!;
    this.domicilioComercial = domicilioComercial!;
    this.cuit = cuit!;
    this.fechaInicioActividades = fechaInicioActividades!;
    this.condicionIva = condicionIva!;
    this.logo = logo!;
    this.contrasenaInstagram = contrasenaInstagram!;
    this.usuarioInstagram = usuarioInstagram!;
  }
}
