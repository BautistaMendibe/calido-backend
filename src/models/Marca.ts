export class Marca {
  id: number;
  nombre: string;

  constructor(id?: number, nombre?: string) {
    this.id = id ? id : null;
    this.nombre = nombre ? nombre : null;
  }
}
