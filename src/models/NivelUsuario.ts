import { Expose, Transform } from 'class-transformer';

export class NivelUsuario {
  @Expose({ name: 'Permiso' })
  nivel: number;
  @Expose({ name: 'CodArea' })
  area: string;
  @Expose({ name: 'CodOficina' })
  oficina: string;
  @Expose({ name: 'Usuario' })
  usuario: string;
}
