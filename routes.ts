import { schemaEmpty } from './middlewares/ValidationSchema';
import { buscarUltimosClientes, UsersController } from './src/controllers/UsersController';
import { ProveedoresController } from './src/controllers/ProveedoresController';
import { PromocionesController } from './src/controllers/PromocionesController';
import { DomicilioController } from './src/controllers/DomicilioController';
import { ConfiguracionesController } from './src/controllers/ConfiguracionesController';
import { consultarProductosConStockLimitado, ProductosController } from './src/controllers/ProductosController';
import { MarcasController } from './src/controllers/MarcaController';
import { VentasController } from './src/controllers/VentasController';
import { TransportesController } from './src/controllers/TransportesController';
import { buscarOrdenesDeCompraHome, PedidosController } from './src/controllers/PedidosController';
import { ComprobantesController } from './src/controllers/ComprobantesController';
import { TarjetasController } from './src/controllers/TarjetasController';
import { FilesController } from './src/controllers/FilesController';
import multer from 'multer';
import { CajasController } from './src/controllers/CajasController';

const upload = multer({ storage: multer.memoryStorage() });

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
    path: '/usuarios/consultar-empleados',
    method: 'post',
    action: UsersController.consultarEmpleados,
    schema: schemaEmpty
  },
  {
    path: '/usuarios/consultar-clientes',
    method: 'post',
    action: UsersController.consultarClientes,
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
  {
    path: '/usuarios/obtener-motivos-licencia',
    method: 'get',
    action: UsersController.obtenerMotivosLicencia,
    schema: schemaEmpty
  },
  {
    path: '/usuarios/registrar-licencia',
    method: 'post',
    action: UsersController.registrarLicencia,
    schema: schemaEmpty
  },
  {
    path: '/usuarios/eliminar-licencia/:id',
    method: 'get',
    action: UsersController.eliminarLicencia,
    schema: schemaEmpty
  },
  {
    path: '/usuarios/consultar-licencias',
    method: 'post',
    action: UsersController.consultarLicencias,
    schema: schemaEmpty
  },
  {
    path: '/usuarios/obtener-estados-licencia',
    method: 'get',
    action: UsersController.obtenerEstadosLicencia,
    schema: schemaEmpty
  },
  {
    path: '/usuarios/modificar-licencia',
    method: 'post',
    action: UsersController.modificarLicencia,
    schema: schemaEmpty
  },
  {
    path: '/usuarios/buscar-ultimos-clientes',
    method: 'get',
    action: UsersController.buscarUltimosClientes,
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
    path: '/promociones/consultar-promociones-por-producto/:idProducto',
    method: 'get',
    action: PromocionesController.buscarPromocionPorProducto,
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

  {
    path: '/productos/registrar-detalle-producto',
    method: 'post',
    action: ProductosController.registrarDetalleProducto,
    schema: schemaEmpty
  },
  {
    path: '/productos/modificar-detalle-producto',
    method: 'post',
    action: ProductosController.modificarDetalleProducto,
    schema: schemaEmpty
  },
  {
    path: '/productos/consultar-detalles-productos',
    method: 'post',
    action: ProductosController.consultarDetalleProductos,
    schema: schemaEmpty
  },
  {
    path: '/productos/eliminar-detalle-producto/:id',
    method: 'get',
    action: ProductosController.eliminarDetalleProducto,
    schema: schemaEmpty
  },
  {
    path: '/productos/buscar-movimientos-por-producto/:id',
    method: 'get',
    action: ProductosController.consultarMovimientosPorProducto,
    schema: schemaEmpty
  },
  {
    path: '/productos/consultar-productos-stock-limitado',
    method: 'get',
    action: ProductosController.consultarProductosConStockLimitado,
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
  {
    path: '/ventas/obtener-condiciones-iva',
    method: 'get',
    action: VentasController.obtenerCondicionesIva,
    schema: schemaEmpty
  },
  {
    path: '/ventas/obtener-tipos-facturacion',
    method: 'get',
    action: VentasController.obtenerTipoFacturacion,
    schema: schemaEmpty
  },
  {
    path: '/ventas/facturar-venta',
    method: 'post',
    action: VentasController.facturarVentaConAfip,
    schema: schemaEmpty
  },
  {
    path: '/ventas/buscar-ventas',
    method: 'post',
    action: VentasController.buscarVentas,
    schema: schemaEmpty
  },
  {
    path: '/ventas/buscar-ventas-por-cc/:idUsuario',
    method: 'get',
    action: VentasController.buscarVentasPorCC,
    schema: schemaEmpty
  },
  {
    path: '/ventas/anular-venta',
    method: 'post',
    action: VentasController.anularVenta,
    schema: schemaEmpty
  },
  {
    path: '/ventas/buscar-ventas-fecha-hora',
    method: 'post',
    action: VentasController.buscarVentasConFechaHora,
    schema: schemaEmpty
  },
  {
    path: '/ventas/obtener-cantidad-ventas-mensuales',
    method: 'get',
    action: VentasController.buscarCantidadVentasMensuales,
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
  {
    path: '/pedidos/buscar-ordenes-de-compra-home',
    method: 'get',
    action: PedidosController.buscarOrdenesDeCompraHome,
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
  },
  //#endregion

  // region Tarjetas
  {
    path: '/tarjetas/registrar-tarjeta',
    method: 'post',
    action: TarjetasController.registrarTarjeta,
    schema: schemaEmpty
  },
  {
    path: '/tarjetas/consultar-tarjetas',
    method: 'post',
    action: TarjetasController.consultarTarjetas,
    schema: schemaEmpty
  },
  {
    path: '/tarjetas/eliminar-tarjeta/:id',
    method: 'get',
    action: TarjetasController.eliminarTarjeta,
    schema: schemaEmpty
  },
  {
    path: '/tarjetas/buscar-tipo-tarjetas',
    method: 'get',
    action: TarjetasController.buscarTiposTarjetas,
    schema: schemaEmpty
  },
  {
    path: '/tarjetas/modificar-tarjeta',
    method: 'post',
    action: TarjetasController.modificarTarjeta,
    schema: schemaEmpty
  },
  {
    path: '/tarjetas/buscar-cuotas',
    method: 'get',
    action: TarjetasController.consultarCuotas,
    schema: schemaEmpty
  },
  //#endregion

  // region Files
  {
    path: '/files/upload',
    method: 'post',
    action: FilesController.guardarArchivo,
    middleware: [upload.single('file')],
    schema: schemaEmpty
  },
  {
    path: '/files/download/:nombreOriginal',
    method: 'get',
    action: FilesController.obtenerArchivo,
    schema: schemaEmpty
  },
  //#endregion

  // region Cajas
  {
    path: '/cajas/registrar-caja',
    method: 'post',
    action: CajasController.registrarCaja,
    schema: schemaEmpty
  },
  {
    path: '/cajas/consultar-cajas',
    method: 'post',
    action: CajasController.consultarCajas,
    schema: schemaEmpty
  },
  {
    path: '/cajas/eliminar-caja/:id',
    method: 'get',
    action: CajasController.eliminarCaja,
    schema: schemaEmpty
  },
  {
    path: '/cajas/modificar-caja',
    method: 'post',
    action: CajasController.modificarCaja,
    schema: schemaEmpty
  },
  {
    path: '/cajas/registrar-arqueo',
    method: 'post',
    action: CajasController.registrarArqueo,
    schema: schemaEmpty
  },
  {
    path: '/cajas/consultar-arqueos',
    method: 'post',
    action: CajasController.consultarArqueos,
    schema: schemaEmpty
  },
  {
    path: '/cajas/eliminar-arqueo/:id',
    method: 'get',
    action: CajasController.eliminarArqueo,
    schema: schemaEmpty
  },
  {
    path: '/cajas/modificar-arqueo',
    method: 'post',
    action: CajasController.modificarArqueo,
    schema: schemaEmpty
  },
  {
    path: '/cajas/buscar-estados-arqueo',
    method: 'get',
    action: CajasController.obtenerEstadosArqueo,
    schema: schemaEmpty
  }
  //#endregion
];
