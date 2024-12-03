// Archivo de configuración para inversify sin repositorios
import { ReportesService } from '../implementations/ReportesService';
import { ReportesRepository } from '../../repositories/ReportesRepository';

export const TYPES = {
  // Services
  UsersService: Symbol('IUsersService'),
  ProveedoresService: Symbol('IProveedoresService'),
  PromocionesService: Symbol('IPromocionesService'),
  DomicilioService: Symbol('IDomicilioService'),
  ProductosService: Symbol('IProductoService'),
  MarcasService: Symbol('IMarcaService'),
  ConfiguracionesService: Symbol('IConfiguracionesService'),
  VentasService: Symbol('IVentasService'),
  TransportesService: Symbol('ITransportesService'),
  PedidosService: Symbol('IPedidosService'),
  ComprobantesService: Symbol('IComprobantesService'),
  TarjetasService: Symbol('ITarjetasService'),
  FilesService: Symbol('IFilesService'),
  CajasService: Symbol('ICajasService'),
  ReportesService: Symbol('IReportesService'),

  // Repositorys
  UsersRepository: Symbol('IUsersRepository'),
  ProveedoresRepository: Symbol('IProveedoresRepository'),
  PromocionesRepository: Symbol('IPromocionesRepository'),
  DomicilioRepository: Symbol('IDomicilioRepository'),
  ProductosRepository: Symbol('IProductoRepository'),
  MarcasRepository: Symbol('IMarcaRepository'),
  ConfiguracionesRepository: Symbol('IConfiguracionesRepository'),
  VentasRepository: Symbol('IVentasRepository'),
  TransportesRepository: Symbol('ITransportesRepository'),
  PedidosRepository: Symbol('IPedidosRepository'),
  ComprobantesRepository: Symbol('IComprobantesRepository'),
  TarjetasRepository: Symbol('ITarjetasRepository'),
  FilesRepository: Symbol('IFilesRepository'),
  CajasRepository: Symbol('ICajasRepository'),
  ReportesRepository: Symbol('IReportesRepository')
};
