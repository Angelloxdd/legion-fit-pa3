# Legion Fit

Legion Fit es una aplicación web para organizar tareas y objetivos personales. Cada usuario puede crear una cuenta, iniciar sesión y administrar su propia lista de tareas.

## Funciones

- Registro e inicio de sesión con correo y contraseña.
- Crear tareas con título y descripción.
- Ver el estado y la fecha de cada tarea, y eliminarla cuando ya no se necesite.
- Consultar un resumen de tareas pendientes y completadas.
- Guardar cuentas y tareas en MongoDB.

## Requisitos

- [Node.js](https://nodejs.org/) (incluye npm).
- Una base de datos MongoDB local o una cuenta de [MongoDB Atlas](https://www.mongodb.com/atlas).

## Instalación y ejecución

Clona el repositorio y entra a la carpeta del proyecto:

```powershell
git clone https://github.com/Angelloxdd/legion-fit-pa3.git
cd legion-fit-pa3
```

### 1. Configurar el servidor

Abre una terminal en la carpeta del proyecto y ejecuta:

```powershell
cd server
npm install
Copy-Item .env.example .env
```

Edita `server/.env` y configura las variables:

```env
PORT=5000
MONGODB_URI=tu_direccion_de_conexion_de_mongodb
JWT_SECRET=una_clave_secreta_larga
JWT_EXPIRES_IN=1h
CLIENT_URL=http://localhost:5173
```

Si usas MongoDB Atlas, copia la dirección de conexión de tu clúster en `MONGODB_URI`. Asegúrate de que el usuario de base de datos y tu dirección IP tengan acceso en Atlas.

Inicia el servidor:

```powershell
npm run dev
```

### 2. Configurar la página

Deja abierta la terminal del servidor. Abre una segunda terminal en la carpeta raíz del proyecto y ejecuta:

```powershell
cd client
npm install
Copy-Item .env.example .env
npm run dev
```

Abre en el navegador la dirección que muestra Vite, normalmente [http://localhost:5173](http://localhost:5173).

Para usar la aplicación, registra una cuenta o inicia sesión. El servidor debe permanecer ejecutándose mientras uses la página.

## Compilar para producción

Desde una terminal en la carpeta `server`, ejecuta:

```powershell
npm run build
```

Desde otra terminal en la carpeta `client`, ejecuta:

```powershell
npm run build
```

## Tecnologías

React, TypeScript, Vite, Node.js, Express, MongoDB, Mongoose, JSON Web Token y bcryptjs.

## Repositorio

[Ver Legion Fit en GitHub](https://github.com/Angelloxdd/legion-fit-pa3)

El archivo `.env` contiene datos privados de conexión y no debe compartirse ni subirse al repositorio. Para configurar el proyecto, usa los archivos `.env.example` como referencia.