import * as jwt from 'jsonwebtoken';
import config from '../config/config';

export const schemaEmpty = {};
export const schemaGetConsultWebUser = {
  id: {
    custom: {
      options: (value: any, { req }: any) => {
        const jwtPayload = <any>jwt.verify(req.headers.authorization, config.jwtSecret, {
          algorithms: ['HS512']
        });
        if (jwtPayload.usuario.id != value) {
          return false;
        } else if (!value) {
          return false;
        }
        return true;
      },
      errorMessage: 'No posee permisos para el recurso.'
    },
    isLength: {
      errorMessage: 'El id es obligatorio.',
      options: { min: 1 }
    },
    isInt: {
      options: {
        min: 1,
        max: 999999
      }
    },
    errorMessage: 'Valor inválido.'
  }
};

export const schemaCreateConsultWebUser = {
  idUsuario: {
    custom: {
      options: (value: any, { req }: any) => {
        const jwtPayload = <any>jwt.verify(req.headers.authorization, config.jwtSecret, {
          algorithms: ['HS512']
        });
        if (jwtPayload.usuario.id != value) {
          return false;
        } else if (!value) {
          return false;
        }
        return true;
      },
      errorMessage: 'No posee permisos para el recurso.'
    },
    isLength: {
      errorMessage: 'El id usuario es obligatorio.',
      options: { min: 1 }
    },
    isInt: {
      options: {
        min: 1,
        max: 999999
      }
    },
    errorMessage: 'Id usuario inválido.'
  },
  idAsunto: {
    isLength: {
      errorMessage: 'El id asunto es obligatorio.',
      options: { min: 1 }
    },
    isInt: {
      options: {
        min: 1,
        max: 999999
      }
    },
    errorMessage: 'Id asunto inválido.'
  },
  mensaje: {
    isLength: {
      errorMessage: 'El mensaje es obligatorio.',
      options: { min: 1, max: 3000 }
    },
    isString: true,
    errorMessage: 'Mensaje inválido.'
  }
};

export const schemaUpdateConsultWebUser = {
  mensaje: {
    isLength: {
      errorMessage: 'El mensaje es obligatorio.',
      options: { min: 1, max: 3000 }
    },
    isString: true,
    errorMessage: 'Mensaje inválido.'
  }
};

export const schemaValidateAffair = {
  idAsunto: {
    isLength: {
      errorMessage: 'El id asunto es obligatorio.',
      options: { min: 1 }
    },
    isInt: {
      options: {
        min: 1,
        max: 999999
      }
    },
    errorMessage: 'Id asunto inválido.'
  },
  idUsuario: {
    isLength: {
      errorMessage: 'El id usuario es obligatorio.',
      options: { min: 1 }
    },
    isInt: {
      options: {
        min: 1,
        max: 999999
      }
    },
    errorMessage: 'Id usuario inválido.'
  }
};

export const sqlInjection = {
  sqlInjection: {
    errorMessage: 'Se detecto código malicioso.',
    custom: {
      options: (value: number, { req, location, path }: any) => {
        const regExpSqlInjection = new RegExp(
          `(\\s*([\0\\b'"\\n\\r\\t%_\\\\]*\\s*(((select\\s*.+\\s*from\\s*.+)|(insert\\s*.+\\s*into\\s*.+)|(update\\s*.+\\s*set\\s*.+)|(delete\\s*.+\\s*from\\s*.+)|(drop\\s*.+)|(truncate\\s*.+)|(alter\\s*.+)|(exec\\s*.+)|(\\s*(all|any|not|and|between|in|like|or|some|contains|containsall|containskey)\\s*.+[=><=!~]+.+)|(let\\s+.+[=]\\s*.*)|(begin\\s*.*\\s*end)|(\\s*[*]+\\s*.*\\s*[*]+)|(\\s*(--)\\s*.*\\s+)|(\\s*(contains|containsall|containskey)\\s+.*)))(\\s*[*]\\s*)*)+)`,
          'ig'
        );

        const auxBody = Object.assign({}, req.body);

        if (req.body?.archivos) {
          auxBody.archivos = '';
        } else if (req.body?.base64) {
          auxBody.base64 = '';
        }

        if (regExpSqlInjection.test(JSON.stringify(auxBody).trim().toLowerCase())) {
          return Promise.reject('Se detecto código malicioso.');
        } else {
          return Promise.resolve();
        }
      }
    }
  }
};

export const schemaGetConsultWebBenefit = {};
export const schemaGetConsultWebUserById = {};
