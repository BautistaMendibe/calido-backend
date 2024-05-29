import { Expose, Transform } from 'class-transformer';
import { ArchivoGenerico } from './ArchivoGenerico';
import { MensajeConsulta } from './MensajeConsulta';

export class ConsultaUsuarioWeb {
  @Expose({ name: 'Id' })
  id: number;
  @Expose({ name: 'Numero' })
  numero: number;
  @Expose({ name: 'Asunto' })
  asunto: string;
  @Expose({ name: 'IdAsunto' })
  idAsunto: number;
  @Expose({ name: 'IdBeneficio' })
  idBeneficio: number;
  @Expose({ name: 'Beneficio' })
  beneficio: string;
  @Expose({ name: 'Estado' })
  estado: string;
  @Expose({ name: 'IdEstado' })
  idEstado: number;
  @Expose({ name: 'FechaAlta' })
  fechaAlta: Date;
  @Expose({ name: 'EsEditable' })
  @Transform((value: string) => value === 'S')
  esEditable: boolean;
  @Expose({ name: 'Mensaje' })
  mensaje: string;
  @Expose({ name: 'MensajeInterno' })
  mensajeInterno: string;
  @Expose({ name: 'IdUsuario' })
  idUsuario: number;
  mensajesConsulta: MensajeConsulta[];
  @Expose({ name: 'Cuil' })
  cuil: number;
  cuilEmpleado: string;
  @Expose({ name: 'TipoConsulta' })
  tipoConsulta: string;
  @Expose({ name: 'NroTelefono' })
  nroTelefono: string;
  @Expose({ name: 'NroCelular' })
  nroCelular: string;
  @Expose({ name: 'Email' })
  email: string;
  @Expose({ name: 'Area' })
  oficina: string;
  @Expose({ name: 'Oficina' })
  area: string;
  @Expose({ name: 'NroDocumento' })
  dni: string;
  @Expose({ name: 'FechaNacimiento' })
  fechaNacimiento: Date;
  @Expose({ name: 'Edad' })
  edad: number;
  @Expose({ name: 'Nombre' })
  nombre: string;
  @Expose({ name: 'Apellido' })
  apellido: string;
  archivos: ArchivoGenerico[];
  @Expose({ name: 'CuilRepresentante' })
  cuilRepresentante: string;
  @Expose({ name: 'NombreYApellidoRepresentante' })
  apellidoNombreRepresentante: string;
  @Expose({ name: 'NombreUsuario' })
  nombreUsuario: string;

  constructor(
    id?: number,
    numero?: number,
    asunto?: string,
    idAsunto?: number,
    idBeneficio?: number,
    estado?: string,
    idEstado?: number,
    fechaAlta?: Date,
    esEditable?: boolean,
    mensaje?: string,
    mensajeInterno?: string,
    idUsuario?: number,
    cuil?: number,
    cuilEmpleado?: string,
    tipoConsulta?: string,
    nroTelefono?: string,
    nroCelular?: string,
    email?: string,
    beneficio?: string,
    oficina?: string,
    area?: string,
    dni?: string,
    fechaNacimiento?: Date,
    edad?: number,
    nombre?: string,
    apellido?: string,
    cuilRepresentante?: string,
    apellidoNombreRepresentante?: string,
    nombreUsuario?: string
  ) {
    this.id = id;
    this.numero = numero;
    this.asunto = asunto;
    this.idAsunto = idAsunto;
    this.idBeneficio = idBeneficio;
    this.estado = estado;
    this.idEstado = idEstado;
    this.fechaAlta = fechaAlta;
    this.esEditable = esEditable;
    this.mensaje = mensaje;
    this.mensajeInterno = mensajeInterno;
    this.idUsuario = idUsuario;
    this.cuil = cuil;
    this.cuilEmpleado = cuilEmpleado;
    this.tipoConsulta = tipoConsulta;
    this.nroTelefono = nroTelefono;
    this.nroCelular = nroCelular;
    this.email = email;
    this.beneficio = beneficio;
    this.oficina = oficina;
    this.area = area;
    this.dni = dni;
    this.fechaNacimiento = fechaNacimiento;
    this.edad = edad;
    this.nombre = nombre;
    this.apellido = apellido;
    this.cuilRepresentante = cuilRepresentante;
    this.apellidoNombreRepresentante = apellidoNombreRepresentante;
    this.nombreUsuario = nombreUsuario;
  }
}
