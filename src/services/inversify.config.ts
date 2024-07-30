import { Container } from 'inversify';
import { TYPES } from './types/types';
import { IUsersService } from './interfaces/IUserService';
import { UsersService } from './implementations/UsersService';
import { IUsersRepository, UsersRepository } from '../repositories/UsersRepository';
import { IProveedoresRepository, ProveedoresRepository } from '../repositories/ProveedoresRepository';
import { IProveedoresService } from './interfaces/IProveedoresService';
import { ProveedoresService } from './implementations/ProveedoresService';
import { IProductosService } from './interfaces/IProductosService';
import { ProductosService } from './implementations/ProductosService';
import { IProductosRepository, ProductosRepository } from '../repositories/ProductosRepository';
import { DomicilioRepository, IDomicilioRepository } from '../repositories/DomicilioRepository';
import { IDomicilioService } from './interfaces/IDomicilioService';
import { DomicilioService } from './implementations/DomicilioService';

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
container.bind<IDomicilioRepository>(TYPES.DomicilioRepository).to(DomicilioRepository);
container.bind<IDomicilioService>(TYPES.DomicilioService).to(DomicilioService);
export default container;
