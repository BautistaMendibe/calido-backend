import { Expose } from 'class-transformer';

export class ComprobanteResponse {
  error?: string;
  errores?: string[];
  rta?: string;
  cae?: string;
  requiere_fec?: string;

  @Expose({ name: 'vencimiento_cae' })
  vencimiento_cae?: string;

  @Expose({ name: 'vencimiento_pago' })
  vencimiento_pago?: string;

  @Expose({ name: 'comprobante_pdf_url' })
  comprobante_pdf_url?: string;

  @Expose({ name: 'comprobante_ticket_url' })
  comprobante_ticket_url?: string;

  afip_qr?: string;
  afip_codigo_barras?: string;
  envio_x_mail?: string;

  @Expose({ name: 'external_reference' })
  external_reference?: string;

  @Expose({ name: 'comprobante_nro' })
  comprobante_nro?: string;

  @Expose({ name: 'comprobante_tipo' })
  comprobante_tipo?: string;

  micrositios?: Micrositios;
  envio_x_mail_direcciones?: string;

  constructor(data: any = {}) {
    this.error = data.error ?? null;
    this.errores = data.errores ?? null;
    this.rta = data.rta ?? null;
    this.cae = data.cae ?? null;
    this.requiere_fec = data.requiere_fec ?? null;
    this.vencimiento_cae = data.vencimiento_cae ?? null;
    this.vencimiento_pago = data.vencimiento_pago ?? null;
    this.comprobante_pdf_url = data.comprobante_pdf_url ?? null;
    this.comprobante_ticket_url = data.comprobante_ticket_url ?? null;
    this.afip_qr = data.afip_qr ?? null;
    this.afip_codigo_barras = data.afip_codigo_barras ?? null;
    this.envio_x_mail = data.envio_x_mail ?? null;
    this.external_reference = data.external_reference ?? null;
    this.comprobante_nro = data.comprobante_nro ?? null;
    this.comprobante_tipo = data.comprobante_tipo ?? null;
    this.micrositios = data.micrositios ? new Micrositios(data.micrositios) : null;
    this.envio_x_mail_direcciones = data.envio_x_mail_direcciones ?? null;
  }
}

class Micrositios {
  cliente?: string;
  descarga?: string;

  constructor(data: any = {}) {
    this.cliente = data.cliente ?? null;
    this.descarga = data.descarga ?? null;
  }
}
