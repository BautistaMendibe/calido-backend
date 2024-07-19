import { Promocion } from '../../models/Promocion';
import { SpResult } from '../../models';
import { FiltrosPromociones } from '../../models/comandos/FiltroPromociones';
import { Producto } from '../../models/Producto';

export interface IPromocionesService {
  registrarPromocion(promocion: Promocion): Promise<SpResult>;
  consultarPromociones(filtro: FiltrosPromociones): Promise<Promocion[]>;
  modificarPromocion(promocion: Promocion): Promise<SpResult>;
  eliminarPromocion(idPromocion: number): Promise<SpResult>;
  buscarProductos(): Promise<Producto[]>;
  buscarProducto(idProducto: number): Promise<Producto>;
}
