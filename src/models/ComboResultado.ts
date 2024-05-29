import { Expose, Transform } from 'class-transformer';

export class ComboResultado {
  @Expose({ name: 'Id' })
  id: number;
  @Expose({ name: 'Nombre' })
  nombre: string;
  @Expose({ name: 'Abreviatura' })
  abreviatura: string;
  @Expose({ name: 'AdjuntaArchivo' })
  @Transform((value) => value === 'S')
  permiteAdjuntarArchivos: boolean;

  constructor(id?: number, nombre?: string, abreviatura?: string, permiteAdjuntarArchivos?: boolean) {
    this.id = id;
    this.nombre = nombre;
    this.abreviatura = abreviatura;
    this.permiteAdjuntarArchivos = permiteAdjuntarArchivos;
  }
}
