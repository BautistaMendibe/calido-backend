import { FiltrosReportesComando } from './FiltrosReportes';
import { DataReporteComando } from './DataReporte';

export class ReporteComando {
  nombre: string;
  funcionSP: string;
  filtros: FiltrosReportesComando;
  activo: boolean = false;
  data: DataReporteComando[];

  constructor(nombre: string, funcionSP: string, filtros?: FiltrosReportesComando, data?: DataReporteComando[]) {
    this.nombre = nombre!;
    this.funcionSP = funcionSP!;
    this.filtros = filtros!;
    this.data = data!;
  }
}
