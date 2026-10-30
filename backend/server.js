require("dotenv").config();
require("dns").setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const conectarDB = require("./config/db");
const productosRoutes = require("./routes/productosRoutes");
const pedidosRoutes = require("./routes/pedidosRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const puerto = process.env.PORT || 4005;

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(express.json());
app.use("/api/productos", productosRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Servidor de Kombechi funcionando");
});

const iniciarServidor = async () => {
  try {
    await conectarDB();

    app.listen(puerto, () => {
      console.log("Servidor listo en http://localhost:" + puerto);
    });
  } catch (error) {
    console.log("Error al conectar con MongoDB:", error.message);
  }
};

iniciarServidor();
