import { Expose } from 'class-transformer';

export class EmpleadoRh {
  @Expose({ name: 'APELLIDO_NOMBRE_EMPLEADO' }) nombreApellido: string;

  constructor(nombre?: string) {
    this.nombreApellido = nombre;
  }
}
