# Kombechi

Tienda de kombucha y kéfir artesanal. El proyecto usa React y Vite para la página, Node.js y Express para la API, y MongoDB para productos y pedidos.

## Estructura

```text
Kombechi-1/
├── backend/
│   ├── config/                 conexión a MongoDB
│   ├── controllers/            acciones de la API para productos, pedidos y administración
│   ├── data/                   archivo JSON de referencia de productos
│   ├── middleware/             verificación de acceso administrativo
│   ├── models/                 modelos de productos y pedidos para MongoDB
│   ├── routes/                 rutas de productos, pedidos y administración
│   ├── .env.example            ejemplo de variables de configuración
│   ├── generarHash.js          generación del hash de contraseña administrativa
│   ├── package.json            dependencias y comandos del backend
│   ├── package-lock.json       versiones instaladas del backend
│   └── server.js               configuración e inicio de Express
├── frontend/                   versión anterior de la tienda
│   ├── assets/img/             imágenes de la tienda
│   ├── index.html              página principal
│   ├── admin.html              página de administración
│   ├── script.js               lógica de la tienda
│   ├── admin.js                lógica del panel
│   ├── styles.css              estilos de la tienda
│   └── admin.css               estilos del panel
├── frontend-react/
│   ├── public/                 imágenes y otros recursos estáticos
│   ├── src/
│   │   ├── components/         componentes de tienda y administración
│   │   ├── App.jsx              página principal y catálogo
│   │   ├── api.js               solicitudes del frontend a la API
│   │   ├── main.jsx             inicio de la aplicación React
│   │   ├── styles.css           estilos de la tienda
│   │   └── admin.css            estilos del panel de administración
│   ├── package.json            dependencias y comandos de React/Vite
│   ├── package-lock.json       versiones instaladas del frontend
│   ├── README.md                instrucciones del frontend
│   ├── admin.html               entrada del panel de administración
│   ├── index.html               entrada de la tienda React
│   └── vite.config.js           configuración de Vite y proxy hacia el backend
├── .gitignore                  archivos locales que Git debe ignorar
└── README.md                   descripción y guía de uso del proyecto
```

## Requisitos

- Node.js 22 o superior.
- Una base de datos MongoDB accesible desde el equipo donde se ejecutará el servidor.
- Configurar las variables del backend en `backend/.env`, tomando como referencia `backend/.env.example`.

## Tecnologías usadas

- **Frontend:** HTML, CSS, JavaScript, React y Vite.
- **Backend:** Node.js, Express y Mongoose.
- **Base de datos:** MongoDB.
- **Autenticación del administrador:** JSON Web Token (JWT) y bcrypt.

## Cómo ejecutar

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend React

```bash
cd frontend-react
npm install
npm run dev
```

Abre la dirección local que muestra Vite.

## Funciones

- Consulta productos en MongoDB y permite buscar, filtrar y ordenar el catálogo.
- Guarda los pedidos del formulario en MongoDB.
- Permite que el administrador inicie sesión y cree, edite y elimine productos.
- Muestra los pedidos y permite cambiar su estado entre `Pendiente` y `Listo`.
- Protege las rutas de gestión con inicio de sesión.
