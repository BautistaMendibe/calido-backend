import { Container } from 'inversify';
import { TYPES } from './types/types';
import { IUsersService } from './interfaces/IUserService';
import { UsersService } from './implementations/UsersService';
import { IUsersRepository, UsersRepository } from '../repositories/UsersRepository';
import { IProveedoresRepository, ProveedoresRepository } from '../repositories/ProveedoresRepository';
import { IProveedoresService } from './interfaces/IProveedoresService';
import { ProveedoresService } from './implementations/ProveedoresService';
import { IPromocionesRepository, PromocionesRepository } from '../repositories/PromocionesRepository';
import { IPromocionesService } from './interfaces/IPromocionesService';
import { PromocionesService } from './implementations/PromocionesService';
import { IProductosService } from './interfaces/IProductosService';
import { ProductosService } from './implementations/ProductosService';
import { IProductosRepository, ProductosRepository } from '../repositories/ProductosRepository';
import { DomicilioRepository, IDomicilioRepository } from '../repositories/DomicilioRepository';
import { DomicilioService } from './implementations/DomicilioService';
import { IDomicilioService } from './interfaces/IDomicilioService';
import { IConfiguracionesService } from './interfaces/IConfiguracionesService';
import { ConfiguracionesService } from './implementations/ConfiguracionesService';
import { ConfiguracionesRepository, IConfiguracionesRepository } from '../repositories/ConfiguracionesRepository';
import { IMarcaService } from './interfaces/IMarcaService';
import { MarcaService } from './implementations/MarcaService';
import { IMarcasRepository, MarcasRepository } from '../repositories/MarcasRepository';

/**
 * Clase encargada de hacer el registro de todas las interfaces, con sus respectivos tipos e implementaciones
 * para que queden disponibles en el contenedor de injección de dependencias.
 */

const container = new Container();
container.bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository);
container.bind<IUsersService>(TYPES.UsersService).to(UsersService);
container.bind<IProveedoresRepository>(TYPES.ProveedoresRepository).to(ProveedoresRepository);
container.bind<IProveedoresService>(TYPES.ProveedoresService).to(ProveedoresService);
container.bind<IProductosService>(TYPES.ProductosService).to(ProductosService);
container.bind<IProductosRepository>(TYPES.ProductosRepository).to(ProductosRepository);
container.bind<IPromocionesRepository>(TYPES.PromocionesRepository).to(PromocionesRepository);
container.bind<IPromocionesService>(TYPES.PromocionesService).to(PromocionesService);
container.bind<IDomicilioRepository>(TYPES.DomicilioRepository).to(DomicilioRepository);
container.bind<IDomicilioService>(TYPES.DomicilioService).to(DomicilioService);
container.bind<IMarcasRepository>(TYPES.MarcasRepository).to(MarcasRepository);
container.bind<IMarcaService>(TYPES.MarcasService).to(MarcaService);
container.bind<IConfiguracionesService>(TYPES.ConfiguracionesService).to(ConfiguracionesService);
container.bind<IConfiguracionesRepository>(TYPES.ConfiguracionesRepository).to(ConfiguracionesRepository);
export default container;
