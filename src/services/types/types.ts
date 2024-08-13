// Archivo de configuración para inversify sin repositorios
export const TYPES = {
  UsersService: Symbol('IUsersService'),
  UsersRepository: Symbol('IUsersRepository'),
  ProveedoresService: Symbol('IProveedoresService'),
  ProveedoresRepository: Symbol('IProveedoresRepository'),
  PromocionesService: Symbol('IPromocionesService'),
  PromocionesRepository: Symbol('IPromocionesRepository'),
  DomicilioService: Symbol('IDomicilioService'),
  DomicilioRepository: Symbol('IDomicilioRepository'),
  ProductosService: Symbol('IProductoService'),
  ProductosRepository: Symbol('IProductoRepository'),
  MarcasService: Symbol('IMarcaService'),
  MarcasRepository: Symbol('IMarcaRepository'),
  ConfiguracionesService: Symbol('IConfiguracionesService'),
  ConfiguracionesRepository: Symbol('IConfiguracionesRepository')
};
