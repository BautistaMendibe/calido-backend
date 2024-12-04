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
import { VentasService } from './implementations/VentasService';
import { IVentasService } from './interfaces/IVentasService';
import { IVentasRepository, VentasRepository } from '../repositories/VentasRepository';
import { ITransportesService } from './interfaces/ITransportesService';
import { ITransportesRepository, TransportesRepository } from '../repositories/TransportesRepository';
import { TransportesService } from './implementations/TransportesService';
import { IPedidosService } from './interfaces/IPedidosService';
import { PedidosService } from './implementations/PedidosService';
import { IPedidosRepository, PedidosRepository } from '../repositories/PedidosRepository';
import { ComprobantesRepository, IComprobantesRepository } from '../repositories/ComprobantesRepository';
import { ComprobantesService } from './implementations/ComprobantesService';
import { IComprobantesService } from './interfaces/IComprobantesService';
import { ITarjetasService } from './interfaces/ITarjetasService';
import { TarjetasService } from './implementations/TarjetasService';
import { ITarjetasRepository, TarjetasRepository } from '../repositories/TarjetasRepository';
import { IFilesService } from './interfaces/IFilesService';
import { FilesService } from './implementations/FilesService';
import { FilesRepository, IFilesRepository } from '../repositories/FilesRepository';
import { ICajasService } from './interfaces/ICajasService';
import { CajasService } from './implementations/CajasService';
import { CajasRepository, ICajasRepository } from '../repositories/CajasRepository';
import { IReportesService } from './interfaces/IReportesService';
import { ReportesService } from './implementations/ReportesService';
import { IReportesRepository, ReportesRepository } from '../repositories/ReportesRepository';

/**
 * Clase encargada de hacer el registro de todas las interfaces, con sus respectivos tipos e implementaciones
 * para que queden disponibles en el contenedor de injección de dependencias.
 */

const container = new Container();

// Services
container.bind<IUsersService>(TYPES.UsersService).to(UsersService);
container.bind<IProveedoresService>(TYPES.ProveedoresService).to(ProveedoresService);
container.bind<IProductosService>(TYPES.ProductosService).to(ProductosService);
container.bind<IPromocionesService>(TYPES.PromocionesService).to(PromocionesService);
container.bind<IDomicilioService>(TYPES.DomicilioService).to(DomicilioService);
container.bind<IMarcaService>(TYPES.MarcasService).to(MarcaService);
container.bind<IConfiguracionesService>(TYPES.ConfiguracionesService).to(ConfiguracionesService);
container.bind<IVentasService>(TYPES.VentasService).to(VentasService);
container.bind<ITransportesService>(TYPES.TransportesService).to(TransportesService);
container.bind<IPedidosService>(TYPES.PedidosService).to(PedidosService);
container.bind<IComprobantesService>(TYPES.ComprobantesService).to(ComprobantesService);
container.bind<ITarjetasService>(TYPES.TarjetasService).to(TarjetasService);
container.bind<IFilesService>(TYPES.FilesService).to(FilesService);
container.bind<ICajasService>(TYPES.CajasService).to(CajasService);
container.bind<IReportesService>(TYPES.ReportesService).to(ReportesService);

// Repositorys
container.bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository);
container.bind<IProveedoresRepository>(TYPES.ProveedoresRepository).to(ProveedoresRepository);
container.bind<IProductosRepository>(TYPES.ProductosRepository).to(ProductosRepository);
container.bind<IPromocionesRepository>(TYPES.PromocionesRepository).to(PromocionesRepository);
container.bind<IDomicilioRepository>(TYPES.DomicilioRepository).to(DomicilioRepository);
container.bind<IMarcasRepository>(TYPES.MarcasRepository).to(MarcasRepository);
container.bind<IConfiguracionesRepository>(TYPES.ConfiguracionesRepository).to(ConfiguracionesRepository);
container.bind<IVentasRepository>(TYPES.VentasRepository).to(VentasRepository);
container.bind<ITransportesRepository>(TYPES.TransportesRepository).to(TransportesRepository);
container.bind<IPedidosRepository>(TYPES.PedidosRepository).to(PedidosRepository);
container.bind<IComprobantesRepository>(TYPES.ComprobantesRepository).to(ComprobantesRepository);
container.bind<ITarjetasRepository>(TYPES.TarjetasRepository).to(TarjetasRepository);
container.bind<IFilesRepository>(TYPES.FilesRepository).to(FilesRepository);
container.bind<ICajasRepository>(TYPES.CajasRepository).to(CajasRepository);
container.bind<IReportesRepository>(TYPES.ReportesRepository).to(ReportesRepository);

export default container;
