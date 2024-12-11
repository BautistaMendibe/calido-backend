import { Expose } from 'class-transformer';

export class VentasMensuales {
  @Expose({ name: 'mes_anio' })
  mes: string;
  @Expose({ name: 'total_ventas' })
  total: number;

  constructor(mes?: string, total?: number) {
    this.mes = mes!;
    this.total = total!;
  }
}
