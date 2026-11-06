import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    proxy: {
      // Puerto local de express 4005
      "/api": "http://localhost:4005"
    }
  },
  build: {
    rollupOptions: {
      input: {
        tienda: "index.html",
        admin: "admin.html"
      }
    }
  }
});
