import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../../../config/config';
import { TokenData } from '../../models/TokenData';
import { IUtilsService } from '../interfaces/IUtilsService';

export class UtilsService implements IUtilsService {
  public static getUserId(request: Request): number {
    return this.getTokenData(request).usuario?.id;
  }

  public static getUserCuil(request: Request): string {
    return this.getTokenData(request).usuario?.cuil;
  }

  public static getRepresentedCuil(request: Request): string {
    return this.getTokenData(request).usuario?.cuilRepresentado;
  }

  public static isEmployee(request: Request): boolean {
    return this.getTokenData(request).tipoUsuario[1]?.id === 2;
  }

  private static getTokenData(request: Request): TokenData {
    return jwt.verify(request.headers.authorization, config.jwtSecret) as TokenData;
  }
}
