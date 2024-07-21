import { Expose } from 'class-transformer';

export class Usuario {
  @Expose({ name: 'idusuario' })
  id: number;
  @Expose({ name: 'nusuario' })
  nombreUsuario: string;
  @Expose({ name: 'nombre' })
  nombre: string;
  @Expose({ name: 'apellido' })
  apellido: string;
  @Expose({ name: 'fecnacimiento' })
  fechaNacimiento: Date;
  @Expose({ name: 'codigopostal' })
  codigoPostal: number;
  @Expose({ name: 'dni' })
  dni: number;
  @Expose({ name: 'cuil' })
  cuil: string;
  @Expose({ name: 'contrasena' })
  contrasena: string;
  @Expose({ name: 'idtipousuario' })
  idTipoUsuario: number;
  @Expose({ name: 'idgenero' })
  idGenero: number;
  @Expose({ name: 'iddomicilio' })
  idDomicilio: number;

  constructor(
    id?: number,
    nombreUsuario?: string,
    nombre?: string,
    apellido?: string,
    fechaNacimiento?: Date,
    codigoPostal?: number,
    dni?: number,
    cuil?: string,
    contrasena?: string,
    idTipoUsuario?: number,
    idGenero?: number,
    idDomicilio?: number
  ) {
    this.id = id ? id : null;
    this.nombreUsuario = nombreUsuario ? nombreUsuario : null;
    this.nombre = nombre ? nombre : null;
    this.apellido = apellido ? apellido : null;
    this.fechaNacimiento = fechaNacimiento ? fechaNacimiento : null;
    this.codigoPostal = codigoPostal ? codigoPostal : null;
    this.dni = dni ? dni : null;
    this.cuil = cuil ? cuil : null;
    this.contrasena = contrasena ? contrasena : null;
    this.idTipoUsuario = idTipoUsuario ? idTipoUsuario : null;
    this.idGenero = idGenero ? idGenero : null;
    this.idDomicilio = idDomicilio ? idDomicilio : null;
  }
}
