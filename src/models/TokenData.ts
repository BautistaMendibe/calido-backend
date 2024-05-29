export interface TokenData {
  tipoUsuario: TipoUsuario[];
  usuario: Usuario;
  iat: number;
  exp: number;
}

interface TipoUsuario {
  id: number;
  nombre: string;
  nombreImagen: string;
}

interface Usuario {
  nombre: string;
  apellido: string;
  id: number;
  nroDocumento: string;
  cuil: string;
  cuilRepresentado: string;
  nivelCidi: number;
}
