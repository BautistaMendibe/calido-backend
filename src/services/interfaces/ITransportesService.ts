import { Transporte } from '../../models/Transporte';

export interface ITransportesService {
  obtenerTransportes(): Promise<Transporte[]>;
}
