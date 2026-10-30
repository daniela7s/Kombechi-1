const express = require("express");

const app = express();
const puerto = 3000;

app.get("/", function (req, res) {
  res.send("Servidor de Kombechi funcionando");
});

app.listen(puerto, function () {
  console.log("Servidor listo en http://localhost:" + puerto);
});