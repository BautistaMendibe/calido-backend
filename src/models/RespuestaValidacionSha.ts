import { Expose } from 'class-transformer';

export class RespuestaValidacionSha {
  @Expose({ name: 'IdDoc' })
  idTipoDoc: number;
  @Expose({ name: 'IdArchivo' })
  idArchivo: number;
  @Expose({ name: 'Sha' })
  sha: number;
  @Expose({ name: 'IdPersona' })
  nroInterno: string;

  constructor(idTipoDoc: number, idArchivo: number, sha: number, nroInterno: string) {
    this.idTipoDoc = idTipoDoc;
    this.idArchivo = idArchivo;
    this.sha = sha;
    this.nroInterno = nroInterno;
  }
}
