export class DocumentoCdd {
  id_documento: number;
  id_tipo_documento: number;
  imagen_str: string;
  formato: string;
  nombre: string;
  descripcion: string;

  constructor(id_documento?: number, id_tipo_documento?: number, imagen_str?: string, formato?: string, nombre?: string, descripcion?: string) {
    this.id_documento = id_documento;
    this.id_tipo_documento = id_tipo_documento;
    this.imagen_str = imagen_str;
    this.formato = formato;
    this.nombre = nombre;
    this.descripcion = descripcion;
  }
}
