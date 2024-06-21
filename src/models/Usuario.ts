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
  @Expose({ name: 'idtipousuario' })
  idTipoUsuario: number;

  constructor(id?: number, nombreUsuario?: string, nombre?: string, apellido?: string, idTipoUsuario?: number) {
    this.id = id ? id : null;
    this.nombreUsuario = nombreUsuario ? nombreUsuario : null;
    this.nombre = nombre ? nombre : null;
    this.apellido = apellido ? apellido : null;
    this.idTipoUsuario = idTipoUsuario ? idTipoUsuario : null;
  }
}
