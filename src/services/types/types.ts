// Archivo de configuración para inversify sin repositorios
export const TYPES = {
  UsersService: Symbol('IUsersService'),
  UsersRepository: Symbol('IUsersRepository'),
  ProveedoresService: Symbol('IProveedoresService'),
  ProveedoresRepository: Symbol('')
};
