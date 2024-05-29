import { Expose, Transform } from 'class-transformer';

export class ArchivoGenerico {
  @Expose({ name: 'IdCdd' })
  idCdd: number;
  @Expose({ name: 'IdTipoDocCdd' })
  idTipoDocCdd: number;
  idDoc: number;
  @Expose({ name: 'IdArchivo' })
  idArchivo: number;
  @Expose({ name: 'IdTipoDoc' })
  idTipoDocumento: number;
  @Expose({ name: 'TipoDocDesc' })
  tipoDocumento: string;
  @Expose({ name: 'Nombre' })
  nombre: string;
  @Expose({ name: 'Tipo' })
  formato: string;
  sha: string;
  blob: unknown;
  base64: string;
  tamanio: number;
  agregado: boolean;
  @Expose({ name: 'Fecha' })
  fecha: Date;
  @Expose({ name: 'EsUsoInterno' })
  @Transform((value) => value === 'S')
  usoInterno: boolean;

  constructor(
    base64?: string,
    idCdd?: number,
    idDoc?: number,
    idArchivo?: number,
    idTipoDocumento?: number,
    tipoDocumento?: string,
    nombre?: string,
    formato?: string,
    sha?: string,
    blob?: unknown,
    tamanio?: number,
    agregado?: boolean,
    fecha?: Date,
    idTipoDocCdd?: number
  ) {
    this.base64 = base64;
    this.idDoc = idDoc;
    this.idCdd = idCdd;
    this.idArchivo = idArchivo;
    this.idTipoDocumento = idTipoDocumento;
    this.tipoDocumento = tipoDocumento;
    this.nombre = nombre;
    this.formato = formato;
    this.sha = sha;
    this.blob = blob;
    this.tamanio = tamanio;
    this.agregado = agregado;
    this.fecha = fecha;
    this.idTipoDocCdd = idTipoDocCdd;
  }
}
