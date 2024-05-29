
# ejemplos

##  Acerca de y objetivo :scroll:
El micro-servicio ejemplos es el encargado de la lógica de negocio para la crecion y visualización de ejemplos.

Se utilizan las siguientes tecnologías:

 - Node Js
 - Express Js
 - Typescript
 - Nodemon
 - TypeORM
 - Oracle Sp Types (Librería de dominio publico, realizada por el equipo)
 - Type model generator (Fork de su versión original modificada por el equipo)

##  Configuración inicial :wrench:
Es necesario:

 - Contar con algún IDE como Visual Studio Code o WebStorm.
 - Contar con node instalado en su version 12.
 - Contar con todas las dependencias instaladas `npm i`.
 - Contar con docker (Linux o Windows), el engine completo. Este punto es opcional para desarrollar.
 - Tener instalado el cliente oracle para la version 12c (Instantclient). Se deja referencia al final del documento.

## Ejecución y despliegue :hammer:
### Ejecución

Ejecutar el siguiente comando parado sobre la carpeta raíz del proyecto a la altura del `package.json`

 - `npm run start:dev`

Este comando ejecuta `nodemon` y escucha todos los cambios que se hagan sobre las rutas definidas en el archivo `nodemon.json`. Para nuestro caso el archivo se verá de la siguiente manera:

`{`
`"watch": ["./src/**/*", ".env"],`
`"ext": ".ts, .js",`
`"exec": "ts-node ./app.ts"`
`}`

El punto de entrada para nuestra aplicación es `app.ts`

### Ejecución dockerizada
Ejecutar el siguiente comando parado sobre la carpeta raíz del proyecto a la altura de `docker-compose.yml` :
<br /><br />
`docker-compose up --build`


### Despliegue


### Uso

El micro-servicio ejemplos tiene definido su archivo `routes.ts` que contiene las rutas disponibles, junto con la clase que hace el manejo lógico de esas rutas. Permite realizar la busqueda de ejemplos/reclamos, el registro de las mismas, y la busqueda de personas por cuil. También brinda un end-point para los asuntos cargados en tabla predefinida.
 <br />

## Referencias :books:
Recursos: <br />
[Node](https://nodejs.org/es/)<br />
[Docker](https://www.docker.com/get-started)<br />
[Oracle instantclient](https://community.oracle.com/docs/DOC-931127)