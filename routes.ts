import { schemaEmpty } from './middlewares/ValidationSchema';
import { UsersController } from './src/controllers/UsersController';
import { ProveedoresController } from './src/controllers/ProveedoresController';
import { PromocionesController } from './src/controllers/PromocionesController';
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
  //#endregion

  // region Promociones
  {
    path: '/promociones/registrar-promocion',
    method: 'post',
    action: PromocionesController.registrarPromocion,
    schema: schemaEmpty
  },
  {
    path: '/promociones/consultar-promociones',
    method: 'post',
    action: PromocionesController.consultarPromociones,
    schema: schemaEmpty
  },
  {
    path: '/promociones/modificar-promocion',
    method: 'post',
    action: PromocionesController.modificarPromocion,
    schema: schemaEmpty
  },
  {
    path: '/promociones/eliminar-promocion/:id',
    method: 'get',
    action: PromocionesController.eliminarPromocion,
    schema: schemaEmpty
  },
  {
    path: '/promociones/buscar-productos',
    method: 'get',
    action: PromocionesController.buscarProductos,
    schema: schemaEmpty
  },
  {
    path: '/promociones/notificar-promocion',
    method: 'post',
    action: PromocionesController.notificarPromocion,
    schema: schemaEmpty
  }
  //#endregion
];
