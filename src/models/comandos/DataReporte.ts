import { Expose } from 'class-transformer';

export class DataReporteComando {
  @Expose({ name: 'col1' })
  dato1: number | string;
  @Expose({ name: 'col2' })
  dato2: number | string;
  @Expose({ name: 'col3' })
  dato3: number | string;
  @Expose({ name: 'col4' })
  dato4: number | string;
  @Expose({ name: 'col5' })
  dato5: number | string;
  @Expose({ name: 'col6' })
  dato6: number | string;
  @Expose({ name: 'col7' })
  dato7: number | string;

  constructor(
    dato1: number | string,
    dato2: number | string,
    dato3: number | string,
    dato4: number | string,
    dato5: number | string,
    dato6: number | string,
    dato7: number | string
  ) {
    this.dato1 = dato1!;
    this.dato2 = dato2!;
    this.dato3 = dato3!;
    this.dato4 = dato4!;
    this.dato5 = dato5!;
    this.dato6 = dato6!;
    this.dato7 = dato7!;
  }
}
