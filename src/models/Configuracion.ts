import { Expose } from 'class-transformer';
import { Usuario } from './Usuario';

export class Configuracion {
  @Expose({ name: 'idconfiguracion' })
  id: number;
  @Expose({ name: 'idusuario' })
  idUsuario: number;
  @Expose({ name: 'razon_social' })
  razonSocial: string;
  @Expose({ name: 'calle' })
  calle: string;
  @Expose({ name: 'numero' })
  numero: number;
  @Expose({ name: 'ciudad' })
  ciudad: string;
  @Expose({ name: 'provincia' })
  provincia: string;
  @Expose({ name: 'codigo_postal' })
  codigoPostal: number;
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
    cuit?: string,
    fechaInicioActividades?: string,
    condicionIva?: string,
    logo?: string,
    contrasenaInstagram?: string,
    usuarioInstagram?: string,
    calle?: string,
    numero?: number,
    ciudad?: string,
    provincia?: string,
    codigoPostal?: number
  ) {
    this.id = id!;
    this.idUsuario = idUsuario!;
    this.razonSocial = razonSocial!;
    this.cuit = cuit!;
    this.fechaInicioActividades = fechaInicioActividades!;
    this.condicionIva = condicionIva!;
    this.logo = logo!;
    this.contrasenaInstagram = contrasenaInstagram!;
    this.usuarioInstagram = usuarioInstagram!;
    this.calle = calle!;
    this.numero = numero!;
    this.ciudad = ciudad!;
    this.provincia = provincia!;
    this.codigoPostal = codigoPostal!;
  }
}
