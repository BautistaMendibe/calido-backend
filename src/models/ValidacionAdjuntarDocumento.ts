import { Expose } from 'class-transformer';

export class ValidacionAdjuntarDocumento {
  id: number;
  puedeAdjuntar: boolean;
  @Expose({ name: 'ValidaDocumentacion' })
  permite: string;

  constructor(id?: number, puedeAdjuntar?: boolean, permite?: string) {
    this.id = id;
    this.puedeAdjuntar = puedeAdjuntar;
    this.permite = permite;
  }
}
