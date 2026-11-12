# Kombechi

Kombechi es un emprendimiento de bebidas fermentadas que combina frescura, calidad y bioquímica aplicada. Elaboramos kombucha con SCOBY y kéfir con gránulos vivos para ofrecer sabores únicos, preparados con atención en cada etapa.

## Estructura

```text
Kombechi-1/
├── backend/
│   ├── config/           conexión a MongoDB y envío de correo (Resend)
│   ├── controllers/      lógica de productos, pedidos, usuarios y administración
│   ├── middleware/       protección de rutas administrativas con JWT
│   ├── models/           esquemas de productos, pedidos y usuarios
│   ├── routes/           rutas de la API
│   ├── .env.example      plantilla de configuración privada
│   ├── generarHash.js    generador del hash de contraseña admin
│   ├── package.json      comandos y dependencias del backend
│   └── server.js         servidor Express
├── docs/                 build del frontend (versión publicada)
├── frontend-react/
│   ├── public/           imágenes y archivos estáticos
│   ├── src/
│   │   ├── components/   componentes de tienda y administración
│   │   ├── utils/        funciones reutilizables de presentación
│   │   ├── App.jsx       página principal y catálogo
│   │   ├── api.js        solicitudes a la API
│   │   ├── admin.css     estilos del panel de administración
│   │   ├── main.jsx      inicio de la aplicación React
│   │   └── styles.css    estilos de la tienda
│   ├── eslint.config.js  reglas de estilo y de Hooks de React
│   ├── index.html        entrada de la tienda
│   └── vite.config.js    configuración de Vite y proxy a Express
├── .gitignore
└── README.md
```

La versión activa de la página es `frontend-react/`. La carpeta `docs/` guarda el build ya compilado que se publica.

## Requisitos

- Node.js 22 o superior.
- Una base de datos MongoDB accesible.

## Tecnologías

- **Frontend:** HTML, CSS, JavaScript, React y Vite.
- **Enrutado:** React Router (cambia entre tienda y panel sin recargar).
- **Backend:** Node.js, Express y Mongoose.
- **Base de datos:** MongoDB.
- **Acceso admin:** bcryptjs y JSON Web Token (JWT).
- **Correo:** Resend (aviso de cada pedido por email).
- **Seguridad:** express-rate-limit (bloquea la fuerza bruta en el login).

## Configurar el backend

Desde una terminal:

```bash
cd backend
npm install
```

Copia la plantilla de variables:

```powershell
Copy-Item .env.example .env
```

En Git Bash puedes usar `cp .env.example .env`.

En `backend/.env`, reemplaza los valores de ejemplo: pega tu URI privada en `MONGO_URI`, elige `ADMIN_USER`, define una clave larga y privada para `JWT_SECRET` y pega tu clave de Resend en `RESEND_API_KEY` (es la que envía el correo de cada pedido). `PORT` ya tiene el valor local `4005`.

Para crear el hash de la contraseña administrativa:

```bash
npm run hash:admin
```

Escribe la contraseña que usarás y copia el hash que aparece en `ADMIN_PASSWORD_HASH` dentro de `.env`. No compartas ni subas `backend/.env` al repositorio.

## Ejecutar localmente

En una terminal, dentro de `backend/`, inicia el servidor en modo desarrollo:

```bash
npm run dev
```

Este comando reinicia Node.js al guardar cambios en el backend. Para iniciar el servidor sin recarga automática, usa `npm start`.

En otra terminal, ejecuta React:

```bash
cd frontend-react
npm install
npm run dev
```

Abre la dirección que muestra Vite, normalmente `http://localhost:5173`; el panel está en `/admin`. React Router cambia entre tienda y panel sin recargar la página. Vite reenvía las solicitudes `/api` al backend local en el puerto `4005`.

Para revisar errores comunes de JavaScript y el uso de Hooks de React, desde `frontend-react/` ejecuta `npm run lint`.

## Desplegar

El backend sirve el frontend ya compilado, así que primero hay que generar el build:

```bash
cd frontend-react
npm run build
```

Esto crea `frontend-react/dist/`, que es lo que Express entrega en producción. En el servidor (por ejemplo Render) se configura:

- **Build Command:** `cd frontend-react && npm install && npm run build`
- **Start Command:** `cd backend && npm install && npm start`
- **Variables de entorno:** las mismas de `.env` (`PORT`, `MONGO_URI`, `ADMIN_USER`, `ADMIN_PASSWORD_HASH`, `JWT_SECRET`, `RESEND_API_KEY`) y `NODE_ENV=production`.

En producción el frontend y el backend comparten dominio: Express entrega `dist/` y el *fallback* devuelve `index.html` en las rutas de React. Por eso no hace falta el proxy de Vite ni hay problemas de CORS. La variable `NODE_ENV=production` activa `trust proxy`, necesario para que el límite de intentos del login vea la IP real del visitante.

## Funciones

- Consulta productos en MongoDB y permite buscar, filtrar y ordenar el catálogo.
- Guarda pedidos en MongoDB; los pedidos nuevos empiezan en `pendiente` y el administrador puede marcarlos como `atendido`.
- Envía un correo de aviso con Resend cada vez que entra un pedido nuevo.
- Permite al administrador iniciar sesión, crear, editar y eliminar productos, y gestionar pedidos.
- Incluye una API CRUD de usuarios (por ahora sin interfaz en el panel).
- Protege las rutas administrativas con un token temporal generado con JWT (válido 2 horas).
- Limita a 5 intentos el inicio de sesión cada 15 minutos por IP.

Los pedidos conservan el nombre del producto como texto para que el registro muestre qué pidió el cliente aunque el catálogo cambie después.
