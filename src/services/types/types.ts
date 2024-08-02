// Archivo de configuración para inversify sin repositorios
export const TYPES = {
  UsersService: Symbol('IUsersService'),
  UsersRepository: Symbol('IUsersRepository'),
  ProveedoresService: Symbol('IProveedoresService'),
  ProveedoresRepository: Symbol('IProveedoresRepository'),
  DomicilioService: Symbol('IDomicilioService'),
  DomicilioRepository: Symbol('IDomicilioRepository'),
  ProductosService: Symbol('IProductoService'),
  ProductosRepository: Symbol('IProductoRepository'),
  MarcasService: Symbol('IMarcaService'),
  MarcasRepository: Symbol('IMarcaRepository')
};
