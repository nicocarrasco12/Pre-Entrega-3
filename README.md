# Trailerflix

## Sumario
- [Descripción y Origen del Dataset](#descripción-y-origen-del-dataset)
- [Objetivo del Proyecto](#objetivo-del-proyecto)
- [Modelo de Datos](#modelo-de-datos)
- [Librerías y Tecnologías](#️librerías-y-tecnologías)
- [Configuración y Ejecución Local](#️configuración-y-ejecución-local)
- [Endpoints](#endpoints)


## Descripción y Origen del Dataset

El set de datos proviene del catálogo oficial de **Trailerflix**, una plataforma de streaming diseñada para gestionar películas y series. El archivo original en formato JSON fue adaptado y estructurado para normalizar su información en un esquema relacional.


## Objetivo del Proyecto

Desarrollar una API REST utilizando Node.js y Express que permita administrar y consultar el catálogo de Trailerflix, conectándose a una base de datos relacional en MySQL mediante Sequelize y consultas SQL optimizadas para manejar relaciones.


## Modelo de Datos

El sistema se diseñó bajo un modelo relacional en MySQL compuesto por 6 tablas principales: `contenido`, `categorías`, `géneros`, `actores`, y dos tablas intermedias (`contenido_actor` y `contenido_genero`) encargadas de resolver las relaciones entre actor con su contenido y los géneros con sus respectivas series, las tablas intermedias fueron consultadas con IA tal como pedía la consigna, luego volcadas a DB Designer lo que nos entregó el SQL DDL que luego usamos en MySQL Workbench para la creación de las tablas.


## Librerías y Tecnologías

- **Node.js**
- **Express**
- **Sequelize**
- **MySQL Workbench**
- **Dotenv**
- **Nodemon**


## Configuración y Ejecución Local
1. Clonar el repositorio en tu computadora.
2. Instalar las dependencias del proyecto ejecutando en la terminal:
```bash
npm install

```

3. Crear un archivo llamado `.env` en la raíz del proyecto basado en el archivo `.env.example` y completar las credenciales de tu conexión local a MySQL (`DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `PORT`).
4. Iniciar el servidor en modo desarrollo ejecutando:
```bash
node server.js

```

## Endpoints

### Contenido

| Método | Endpoint | Descripción |
| --- | --- | --- |
| **GET** | `/contenido` | Devuelve el listado completo de todo el contenido. |
| **GET** | `/contenido/titulo/:titulo` | Busca contenidos de forma parcial por el título. |
| **POST** | `/contenido` | Crea nuevo contenido a partir de los datos enviados en el body en formato JSON. |
| **PUT** | `/contenido/:id` | Modifica un contenido existente buscando por su ID. |
| **DELETE** | `/contenido/:id` | Elimina un registro de contenido utilizando su ID. |

### Categorías

| Método | Endpoint | Descripción |
| --- | --- | --- |
| **GET** | `/categorias` | Lista todas las categorías disponibles. |
| **GET** | `/categorias/:nombre` | Busca una categoría por nombre y devuelve su contenido asociado. |
| **POST** | `/categorias` | Crea una nueva categoría. |
| **PUT** | `/categorias/:id` | Actualiza una categoría por su ID. |
| **DELETE** | `/categorias/:id` | Elimina una categoría por su ID. |

### Géneros

| Método | Endpoint | Descripción |
| --- | --- | --- |
| **GET** | `/generos` | Devuelve el listado completo de géneros. |
| **GET** | `/generos/:nombre` | Busca un género y retorna las series y películas asociadas. |
| **POST** | `/generos` | Registra un nuevo género. |
| **PUT** | `/generos/:id` | Modifica un género existente por su ID. |
| **DELETE** | `/generos/:id` | Elimina un género por su ID. |

### Actores

| Método | Endpoint | Descripción |
| --- | --- | --- |
| **GET** | `/actores` | Devuelve el listado completo de actores. |
| **GET** | `/actores/:nombre` | Busca un actor por su nombre y lista el contenido en el que participó. |
| **POST** | `/actores` | Da de alta un nuevo actor. |
| **PUT** | `/actores/:id` | Actualiza los datos de un actor por su ID. |
| **DELETE** | `/actores/:id` | Elimina un actor utilizando su ID. |
