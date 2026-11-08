import { defineConfig } from "vite";

export default defineConfig({
  server: {
    // Permite abrir Vite desde el navegador en la red local.
    host: "0.0.0.0",
    proxy: {
      // Envía las solicitudes /api al backend Express, que usa el puerto 4005.
      "/api": "http://localhost:4005"
    }
  }
});
