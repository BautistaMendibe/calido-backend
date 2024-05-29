import { Expose } from 'class-transformer';

export class Asunto {
  @Expose({ name: 'RECTIPID' }) id: number;
  @Expose({ name: 'TIPOLOGIA' }) tipologia: string;
  @Expose({ name: 'OBSERVACION' }) observacion: string;

  constructor(id: number, tipologia: string, observacion: string) {
    this.id = id;
    this.tipologia = tipologia;
    this.observacion = observacion;
  }
}
