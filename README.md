# Kombechi

Kombechi es un emprendimiento de bebidas fermentadas que combina frescura, calidad y bioquímica aplicada. Elaboramos kombucha con SCOBY y kéfir con gránulos vivos para ofrecer sabores únicos, preparados con atención en cada etapa.

## Estructura

```text
Kombechi-1/
├── backend/
│   ├── config/          conexión a MongoDB
│   ├── controllers/     lógica de productos, pedidos, usuarios y administración
│   ├── data/            referencia de productos
│   ├── middleware/      protección de rutas administrativas
│   ├── models/          esquemas de productos, pedidos y usuarios
│   ├── routes/          rutas de la API
│   ├── .env.example      plantilla de configuración privada
│   ├── generarHash.js    generador del hash de contraseña admin
│   ├── package.json      comandos y dependencias del backend
│   └── server.js         servidor Express
├── frontend/             versión antigua conservada como referencia
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
│   ├── index.html        entrada de la tienda
│   └── vite.config.js    configuración de Vite y proxy a Express
├── .gitignore
└── README.md
```

La versión activa de la página es `frontend-react/`. La carpeta `frontend/` se conserva como referencia y no es la que se ejecuta.

## Requisitos

- Node.js 22 o superior.
- Una base de datos MongoDB accesible.

## Tecnologías

- **Frontend:** HTML, CSS, JavaScript, React y Vite.
- **Backend:** Node.js, Express y Mongoose.
- **Base de datos:** MongoDB.
- **Acceso admin:** bcryptjs y JSON Web Token (JWT).

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

En `backend/.env`, reemplaza los valores de ejemplo: pega tu URI privada en `MONGO_URI`, elige `ADMIN_USER` y define una clave larga y privada para `JWT_SECRET`. `PORT` ya tiene el valor local `4005`.

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

## Funciones

- Consulta productos en MongoDB y permite buscar, filtrar y ordenar el catálogo.
- Guarda pedidos en MongoDB; los pedidos nuevos empiezan en `pendiente` y el administrador puede marcarlos como `atendido`.
- Permite al administrador iniciar sesión, crear, editar y eliminar productos, y gestionar pedidos.
- Incluye una API CRUD de usuarios.
- Protege las rutas administrativas con un token temporal.

Los pedidos conservan el nombre del producto como texto para que el registro muestre qué pidió el cliente aunque el catálogo cambie después.
