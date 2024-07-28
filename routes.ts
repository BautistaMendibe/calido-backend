import { schemaEmpty } from './middlewares/ValidationSchema';
import { UsersController } from './src/controllers/UsersController';
import { ProveedoresController } from './src/controllers/ProveedoresController';
import { DomicilioController } from './src/controllers/DomicilioController';
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
  },
  {
    path: '/proveedores/buscar-tipos-proveedores',
    method: 'get',
    action: ProveedoresController.buscarTiposProveedores,
    schema: schemaEmpty
  },
  //#endregion

  // region Domicilio
  {
    path: '/domicilio/obtener-provincias',
    method: 'get',
    action: DomicilioController.obtenerProvincias,
    schema: schemaEmpty
  },
  {
    path: '/domicilio/obtener-localidades-por-provincia/:idProvincia',
    method: 'get',
    action: DomicilioController.obtenerLocalidadesPorProvincia,
    schema: schemaEmpty
  }
  //#endregion
];
