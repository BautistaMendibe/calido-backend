import { Expose } from 'class-transformer';

export class ValidacionArchivoTipoDocumento {
  @Expose({ name: 'MismaPersona' })
  mismaPersona: string;
  @Expose({ name: 'Cuil' })
  cuil: string;
  @Expose({ name: 'NroInterno' })
  nroInterno: number;
  @Expose({ name: 'MismoTipo' })
  mismoTipo: string;
  @Expose({ name: 'Tipo' })
  idTipo: number;
  @Expose({ name: 'TipoDocumento' })
  tipoDocumento: string;
  @Expose({ name: 'IdArchivo' })
  idArchivo: number;
  @Expose({ name: 'TramiteEnCurso' })
  tramiteEnCurso: string;

  constructor(mismaPersona?: string, cuil?: string, mismoTipo?: string, idTipo?: number, idArchivo?: number, tramiteEnCurso?: string) {
    this.mismaPersona = mismaPersona;
    this.cuil = cuil;
    this.mismoTipo = mismoTipo;
    this.idTipo = idTipo;
    this.idArchivo = idArchivo;
    this.tramiteEnCurso = tramiteEnCurso;
  }
}
