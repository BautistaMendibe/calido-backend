import { ReporteComando } from '../../models/comandos/Reporte';
import { DataReporteComando } from '../../models/comandos/DataReporte';

export interface IReportesService {
  obtenerDataReporte(reporte: ReporteComando): Promise<DataReporteComando[]>;
}
