import { schemaEmpty } from './middlewares/ValidationSchema';
import { UsersController } from './src/controllers/UsersController';
import { ProveedoresController } from './src/controllers/ProveedoresController';
/**
 * Rutas del Backend.
 */
export const AppRoutes = [
  // region Usuarios
  {
    path: '/usuarios/validar-inicio-sesion',
    method: 'post',
    action: UsersController.validarInicioSesion,
    schema: schemaEmpty
  },
  //#endregion

  // region Proveedores
  {
    path: '/proveedores/registrar-proveedor',
    method: 'post',
    action: ProveedoresController.registrarProveedor,
    schema: schemaEmpty
  }

  //#endregion
];
