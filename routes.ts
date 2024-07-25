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
  {
    path: '/usuarios/registrar-usuario',
    method: 'post',
    action: UsersController.registrarUsuario,
    schema: schemaEmpty
  },
  {
    path: '/usuarios/consultar-usuarios',
    method: 'post',
    action: UsersController.consultarEmpleados,
    schema: schemaEmpty
  },
  {
    path: '/usuarios/modificar-usuario',
    method: 'post',
    action: UsersController.modificarEmpleado,
    schema: schemaEmpty
  },
  {
    path: '/usuarios/eliminar-usuario/:id',
    method: 'get',
    action: UsersController.eliminarUsuario,
    schema: schemaEmpty
  },
  //#endregion

  // region Proveedores
  {
    path: '/proveedores/registrar-proveedor',
    method: 'post',
    action: ProveedoresController.registrarProveedor,
    schema: schemaEmpty
  },
  {
    path: '/proveedores/consultar-proveedores',
    method: 'post',
    action: ProveedoresController.consultarProveedores,
    schema: schemaEmpty
  },
  {
    path: '/proveedores/modificar-proveedor',
    method: 'post',
    action: ProveedoresController.modificarProveedor,
    schema: schemaEmpty
  },
  {
    path: '/proveedores/eliminar-proveedor/:id',
    method: 'get',
    action: ProveedoresController.eliminarProveedor,
    schema: schemaEmpty
  }
  //#endregion
];
