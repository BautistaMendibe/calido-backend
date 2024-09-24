import { schemaEmpty } from './middlewares/ValidationSchema';
import { UsersController } from './src/controllers/UsersController';
import { ProveedoresController } from './src/controllers/ProveedoresController';
import { PromocionesController } from './src/controllers/PromocionesController';
import { DomicilioController } from './src/controllers/DomicilioController';
import { ConfiguracionesController } from './src/controllers/ConfiguracionesController';
import { ProductosController } from './src/controllers/ProductosController';
import { MarcasController } from './src/controllers/MarcaController';
import { VentasController } from './src/controllers/VentasController';
import { TransportesController } from './src/controllers/TransportesController';
import { PedidosController } from './src/controllers/PedidosController';
import { ComprobantesController } from './src/controllers/ComprobantesController';

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
    path: '/usuarios/consultar-asistencias',
    method: 'post',
    action: UsersController.consultarAsistencias,
    schema: schemaEmpty
  },
  {
    path: '/usuarios/registrar-asistencia',
    method: 'post',
    action: UsersController.registrarAsistencia,
    schema: schemaEmpty
  },
  {
    path: '/usuarios/modificar-asistencia',
    method: 'post',
    action: UsersController.modificarAsistencia,
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
  {
    path: '/usuarios/eliminar-asistencia/:id',
    method: 'get',
    action: UsersController.eliminarAsistencia,
    schema: schemaEmpty
  },
  {
    path: '/usuarios/registrar-superusuario',
    method: 'post',
    action: UsersController.registrarSuperusuario,
    schema: schemaEmpty
  },
  {
    path: '/usuarios/consultar-usuarios-cuenta-corriente',
    method: 'post',
    action: UsersController.consultarCuentasCorrientesxUsuario,
    schema: schemaEmpty
  },
  {
    path: '/usuarios/registrar-cuenta-corriente',
    method: 'post',
    action: UsersController.registrarCuentaCorriente,
    schema: schemaEmpty
  },
  {
    path: '/usuarios/modificar-cuenta-corriente',
    method: 'post',
    action: UsersController.modificarCuentaCorriente,
    schema: schemaEmpty
  },
  {
    path: '/usuarios/eliminar-cuenta-corriente/:id',
    method: 'get',
    action: UsersController.eliminarCuentaCorriente,
    schema: schemaEmpty
  },
  {
    path: '/usuarios/consultar-all-usuarios',
    method: 'get',
    action: UsersController.consultarAllUsuarios,
    schema: schemaEmpty
  },
  {
    path: '/usuarios/obtener-roles-usuario/:id',
    method: 'get',
    action: UsersController.obtenerRolesUsuario,
    schema: schemaEmpty
  },
  {
    path: '/usuarios/obtener-roles',
    method: 'get',
    action: UsersController.obtenerRoles,
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
  },
  //#endregion

  // region Configuraciones
  {
    path: '/configuraciones/consultar-configuraciones',
    method: 'get',
    action: ConfiguracionesController.obtenerConfiguraciones,
    schema: schemaEmpty
  },
  {
    path: '/configuraciones/registrar-configuracion',
    method: 'get',
    action: ConfiguracionesController.registrarConfiguracion,
    schema: schemaEmpty
  },
  {
    path: '/configuraciones/modificar-configuracion',
    method: 'post',
    action: ConfiguracionesController.modificarConfiguracion,
    schema: schemaEmpty
  },
  {
    path: '/configuraciones/existe-configuracion',
    method: 'get',
    action: ConfiguracionesController.existeConfiguracion,
    schema: schemaEmpty
  },
  //#endregion

  // region Ventas
  {
    path: '/ventas/registrar-venta',
    method: 'post',
    action: VentasController.registrarVentaConDetalles,
    schema: schemaEmpty
  },
  {
    path: '/ventas/buscar-usuarios-clientes',
    method: 'get',
    action: VentasController.buscarUsuariosClientes,
    schema: schemaEmpty
  },
  {
    path: '/ventas/buscar-formas-de-pago',
    method: 'get',
    action: VentasController.buscarFormasDePago,
    schema: schemaEmpty
  },
  //#endregion

  // region Transportes
  {
    path: '/transportes/buscar-transportes',
    method: 'get',
    action: TransportesController.obtenerTransportes,
    schema: schemaEmpty
  },
  //#endregion

  // region Pedidos
  {
    path: '/pedidos/registrar-pedido',
    method: 'post',
    action: PedidosController.registrarPedido,
    schema: schemaEmpty
  },
  {
    path: '/pedidos/consultar-pedidos',
    method: 'post',
    action: PedidosController.consultarPedidos,
    schema: schemaEmpty
  },
  {
    path: '/pedidos/eliminar-pedido/:id',
    method: 'get',
    action: PedidosController.eliminarPedido,
    schema: schemaEmpty
  },
  {
    path: '/pedidos/buscar-estados-pedido',
    method: 'get',
    action: PedidosController.obtenerEstadosPedido,
    schema: schemaEmpty
  },
  {
    path: '/pedidos/modificar-pedido',
    method: 'post',
    action: PedidosController.modificarPedido,
    schema: schemaEmpty
  },

  // region Comprobantes
  {
    path: '/comprobantes/registrar-comprobante',
    method: 'post',
    action: ComprobantesController.registrarComprobante,
    schema: schemaEmpty
  },
  {
    path: '/comprobantes/consultar-comprobantes',
    method: 'post',
    action: ComprobantesController.consultarComprobantes,
    schema: schemaEmpty
  },
  {
    path: '/comprobantes/eliminar-comprobante/:id',
    method: 'get',
    action: ComprobantesController.eliminarComprobante,
    schema: schemaEmpty
  },
  {
    path: '/comprobantes/buscar-tipos-comprobantes',
    method: 'get',
    action: ComprobantesController.obtenerTiposComprobantes,
    schema: schemaEmpty
  },
  {
    path: '/comprobantes/modificar-comprobante',
    method: 'post',
    action: ComprobantesController.modificarComprobante,
    schema: schemaEmpty
  }
];
