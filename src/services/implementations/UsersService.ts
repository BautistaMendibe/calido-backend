import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { logger } from '../../logger/CustomLogger';
import { TYPES } from '../types/types';
import { IUsersService } from '../interfaces';
import { IUsersRepository } from '../../repositories';
import { SpResult } from '../../models';
import { Usuario } from '../../models/Usuario';
import { FiltroEmpleados } from '../../models/comandos/FiltroEmpleados';
import { Asistencia } from '../../models/Asistencia';
import { FiltroAsistencias } from '../../models/comandos/FiltroAsistencias';
import { FiltroCuentasCorrientes } from '../../models/comandos/FiltroCuentasCorrientes';
import { CuentaCorriente } from '../../models/CuentaCorriente';
import { Rol } from '../../models/Rol';
import { Motivo } from '../../models/Motivo';
import { Licencia } from '../../models/Licencia';
import { FiltrosLicencias } from '../../models/comandos/FiltroLicencias';
import { EstadoLicencia } from '../../models/EstadoLicencia';
import { RecuperarContrasena } from '../../models/RecuperarContrasena';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { UltimosMovimientos } from '../../models/comandos/UltimosMovimientos';
import { FiltrosMovimientosCuentaCorriente } from '../../models/comandos/FiltroMovimientoCuentaCorriente';
import { MovimientoCuentaCorriente } from '../../models/MovimientoCuentaCorriente';

/**
 * Servicio que tiene como responsabilidad
 * lo vinculado a los usuarios
 */
@injectable()
export class UsersService implements IUsersService {
  private readonly _usersRepository: IUsersRepository;

  constructor(
    @inject(TYPES.UsersRepository)
    repository: IUsersRepository
  ) {
    this._usersRepository = repository;
  }

  public async registrarUsuario(usuario: Usuario): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.registrarUsuario(usuario);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }
  public async validarInicioSesion(nombreUsuario: string, contrasena: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.validarInicioSesion(nombreUsuario, contrasena);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async consultarEmpleados(filtro: FiltroEmpleados): Promise<Usuario[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.consultarEmpleados(filtro);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async consultarClientes(filtro: FiltroEmpleados): Promise<Usuario[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.consultarClientes(filtro);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async modificarEmpleado(usuario: Usuario): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.modificarEmpleado(usuario);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async eliminarUsuario(idUsuario: number): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.eliminarUsuario(idUsuario);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async eliminarAsistencia(idAsistencia: number): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.eliminarAsistencia(idAsistencia);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async registrarSuperusuario(usuario: Usuario): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.registrarSuperusuario(usuario);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async consultarAsistencias(filtro: FiltroAsistencias): Promise<Asistencia[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.consultarAsistencias(filtro);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async registrarAsistencia(asistencia: Asistencia): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.registrarAsistencia(asistencia);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async modificarAsistencia(asistencia: Asistencia): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.modificarAsistencia(asistencia);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async obtenerRoles(): Promise<Rol[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.obtenerRoles();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async obtenerRolesUsuario(idUsuario: number): Promise<Rol[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.obtenerRolesUsuario(idUsuario);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async consultarCuentasCorrientesxUsuario(filtro: FiltroCuentasCorrientes): Promise<CuentaCorriente[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.consultarCuentasCorrientesxUsuario(filtro);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async consultarAllUsuarios(): Promise<Usuario[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.consultarAllUsuarios();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async registrarCuentaCorriente(cuentaCorriente: CuentaCorriente): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.registrarCuentaCorriente(cuentaCorriente);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async modificarCuentaCorriente(cuentaCorriente: CuentaCorriente): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.modificarCuentaCorriente(cuentaCorriente);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async eliminarCuentaCorriente(idCuentaCorriente: number): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.eliminarCuentaCorriente(idCuentaCorriente);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async obtenerMotivosLicencia(): Promise<Motivo[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.obtenerMotivosLicencia();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async registrarLicencia(licencia: Licencia): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.registrarLicencia(licencia);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async eliminarLicencia(idLicencia: number): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.eliminarLicencia(idLicencia);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async consultarLicencias(filtro: FiltrosLicencias): Promise<Licencia[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.consultarLicencias(filtro);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async obtenerEstadosLicencia(): Promise<EstadoLicencia[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.obtenerEstadosLicencia();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async modificarLicencia(licencia: Licencia): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.modificarLicencia(licencia);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async buscarUltimosClientes(): Promise<Usuario[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.buscarUltimosClientes();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async buscarUltimosLogs(): Promise<UltimosMovimientos[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.buscarUltimosLogs();
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async recuperarContrasena(recuperarContrasena: RecuperarContrasena): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.recuperarContrasena(recuperarContrasena);

        if (result.mensaje === 'OK') {
          // Generar el JWT

          const token = jwt.sign({ email: recuperarContrasena.correo }, process.env.JWT_SECRET, { expiresIn: '1h' });
          const enlaceRecuperacion = `http://localhost:4200/recuperar-contrasena?token=${token}`;

          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL,
              pass: process.env.GENERATED_APP_PASSWORD
            }
          });

          const mailOptions = {
            from: process.env.EMAIL,
            to: recuperarContrasena.correo,
            subject: 'Recuperación de contraseña',
            html: `
              <div style="font-family: Arial, sans-serif; border: 3px solid #d35400; border-radius: 5px; padding: 20px; max-width: 600px; margin: auto;">
                <h2 style="color: #333;">Hola!</h2>
                <p style="font-size: 16px; color: #555;">Hemos recibido una solicitud para <strong>cambiar la contraseña de tu cuenta</strong> en Calido.</p>
                <div style="text-align: center; margin: 20px 0;">
                  <a href="${enlaceRecuperacion}" 
                     style="display: inline-block; background-color: #f39c12; color: #fff; text-decoration: none; padding: 10px 20px; font-size: 16px; border-radius: 5px;">
                     Haz clic aquí para recuperar tu contraseña
                  </a>
                </div>
                <p style="font-size: 14px; color: #555;">Si crees que esto fue un error, ignora este correo electrónico.</p>
                <p style="font-size: 14px; color: #555; font-style: italic;">El enlace de recuperación expirará en 1 hora.</p>
              </div>
            `
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              logger.error('Error', error);
              result.mensaje = 'ERROR';
            } else {
              logger.info('Email enviado: ' + info.response);
            }
          });
        }

        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async cambiarContrasena(recuperarContrasena: RecuperarContrasena): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!recuperarContrasena.token) {
          reject('Token no proporcionado');
          return;
        }

        // Promesa que envuelve la verificación del JWT
        jwt.verify(recuperarContrasena.token, process.env.JWT_SECRET, async (err: any, decoded: any) => {
          if (err) {
            reject('Token inválido o expirado');
          } else {
            try {
              // Si el token es válido, procedemos con el cambio de contraseña
              recuperarContrasena.correo = decoded.email;
              const result = await this._usersRepository.cambiarContrasena(recuperarContrasena);
              resolve(result);
            } catch (e) {
              logger.error(e);
              reject('Error al cambiar la contraseña');
            }
          }
        });
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async consultarMovimientosCuentaCorriente(filtro: FiltrosMovimientosCuentaCorriente): Promise<MovimientoCuentaCorriente[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.consultarMovimientosCuentaCorriente(filtro);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async eliminarMovimientoCuentaCorriente(idMovimiento: number): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.eliminarMovimientoCuentaCorriente(idMovimiento);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }

  public async registrarMovimientoCuentaCorriente(movimiento: MovimientoCuentaCorriente): Promise<SpResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this._usersRepository.registrarMovimientoCuentaCorriente(movimiento);
        resolve(result);
      } catch (e) {
        logger.error(e);
        reject(e);
      }
    });
  }
}
