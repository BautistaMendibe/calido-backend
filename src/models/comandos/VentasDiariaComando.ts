import { Expose } from 'class-transformer';

export class VentasDiariaComando {
  @Expose({ name: 'hora' })
  mes: string;
  @Expose({ name: 'total_ventas' })
  total: number;
  @Expose({ name: 'total' })
  totalDelDia: number;

  constructor(mes?: string, total?: number, totalDelDia?: number) {
    this.mes = mes!;
    this.total = total!;
    this.totalDelDia = totalDelDia!;
  }
}
