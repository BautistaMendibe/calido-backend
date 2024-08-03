import { schemaEmpty } from './middlewares/ValidationSchema';
import { UsersController } from './src/controllers';
import { ProveedoresController } from './src/controllers/ProveedoresController';
import { DomicilioController } from './src/controllers/DomicilioController';
import { ProductosController } from './src/controllers/ProductosController';
import { MarcasController } from './src/controllers/MarcaController';

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

  {
    path: '/proveedores/buscar-todos-proveedores',
    method: 'post',
    action: ProveedoresController.buscarTodosProveedores,
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
  },
  {
    path: '/domicilio/obtener-localidades-por-provincia/:idProvincia',
    method: 'get',
    action: DomicilioController.obtenerLocalidadesPorProvincia,
    schema: schemaEmpty
  },
  //#endregion

  // region Productos

  {
    path: '/productos/registrar-producto',
    method: 'post',
    action: ProductosController.registrarProducto,
    schema: schemaEmpty
  },
  {
    path: '/productos/modificar-producto',
    method: 'post',
    action: ProductosController.modificarProducto,
    schema: schemaEmpty
  },
  {
    path: '/productos/consultar-productos',
    method: 'post',
    action: ProductosController.consultarProductos,
    schema: schemaEmpty
  },

  {
    path: '/productos/buscar-tipo-productos',
    method: 'post',
    action: ProductosController.consultarTipoProductos,
    schema: schemaEmpty
  },

  {
    path: '/productos/eliminar-producto/:id',
    method: 'get',
    action: ProductosController.eliminarProducto,
    schema: schemaEmpty
  },
  //#endregion

  // Region Marcas
  {
    path: '/marcas/buscar-marcas',
    method: 'post',
    action: MarcasController.obtenerMarcas,
    schema: schemaEmpty
  }
  //#endregion
];
