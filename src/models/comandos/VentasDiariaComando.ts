import { Expose } from 'class-transformer';

export class VentasDiariaComando {
  @Expose({ name: 'hora' })
  hora: string;
  @Expose({ name: 'totalhoy' })
  totalHoy: number;
  @Expose({ name: 'totalayer' })
  totalAyer: number;
  @Expose({ name: 'totaldiahoy' })
  totalDelDiaHoy: number;
  @Expose({ name: 'totaldiaayer' })
  totalDelDiaAyer: number;

  constructor(hora?: string, totalHoy?: number, totalAyer?: number, totalDelDiaHoy?: number, totalDelDiaAyer?: number) {
    this.hora = hora!;
    this.totalHoy = totalHoy!;
    this.totalAyer = totalAyer!;
    this.totalDelDiaHoy = totalDelDiaHoy!;
    this.totalDelDiaAyer = totalDelDiaAyer!;
  }
}
