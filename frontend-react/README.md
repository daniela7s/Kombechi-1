# Kombechi React

## Iniciar en desarrollo

1. Abre una terminal en `backend` y ejecuta `npm start`. El servidor lee `backend/.env` y conecta con MongoDB.
2. Abre otra terminal en `frontend-react` y ejecuta `npm install` una vez y luego `npm run dev`.
3. Abre la dirección que muestra Vite, normalmente `http://localhost:5173`. El panel está en `/admin.html`.

Vite reenvía las solicitudes `/api` al backend local en el puerto 4500. No se conecta el navegador directamente a MongoDB: React usa `fetch`, Express valida la solicitud y Mongoose trabaja con MongoDB.

## Compilar para publicación

Desde la carpeta raíz del repositorio:

```bash
npm --prefix frontend-react install
npm --prefix frontend-react run build
npm --prefix backend install
npm --prefix backend start
```

Express sirve los archivos compilados desde `frontend-react/dist`, junto con las rutas `/api`. Así tienda, panel y backend quedan bajo el mismo dominio.

En Render se puede configurar el directorio raíz como el repositorio completo, el comando de compilación como:

```bash
npm --prefix frontend-react install && npm --prefix frontend-react run build && npm --prefix backend install
```

Y el comando de inicio como:

```bash
npm --prefix backend start
```

Configura en Render las variables privadas `MONGO_URI`, `ADMIN_USER`, `ADMIN_PASSWORD_HASH` y `JWT_SECRET`. Render proporciona `PORT`. Nunca publiques el archivo `backend/.env`.

## Fuente del catálogo

La página y el panel leen y guardan productos en MongoDB mediante la API. `backend/data/productos.json` se conserva solo como referencia estática: la aplicación no lo importa ni lo actualiza, y modificarlo no cambia el catálogo publicado.
