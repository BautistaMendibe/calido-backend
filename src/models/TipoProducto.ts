export class TipoProducto {
  id: number;
  nombre: string;

  constructor(id?: number, nombreTipo?: string) {
    this.id = id ? id : null;
    this.nombre = nombreTipo ? nombreTipo : null;
  }
}
