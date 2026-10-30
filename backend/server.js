const express = require("express");

const app = express();
const puerto = process.env.PORT || 4005;
const productos = require("./data/productos.json");
const pedidos = [];

app.use(express.json());


app.get("/api/productos", (req, res) => {
  res.status(200).json(productos);
});

//GET
app.get("/api/productos/:id", (req, res) => {
  const producto = productos.find((item) => {
    return String(item.id) === req.params.id;
  });

  if (!producto) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }

  res.status(200).json(producto);
});


//post
app.post("/api/productos", (req, res) => {
  const { nombre, categoria, descripcion, precio, imagen } = req.body;

  if (!nombre || !categoria || !descripcion || !precio) {
    return res.status(400).json({
      mensaje: "Faltan datos del producto"
    });
  }

  const nuevoProducto = {
    id: Date.now().toString(),
    nombre,
    categoria,
    descripcion,
    precio: Number(precio),
    imagen: imagen || "",
    destacado: false
  };

  productos.push(nuevoProducto);

  res.status(201).json(nuevoProducto);
});

app.put("/api/productos/:id", (req, res) => {
  const producto = productos.find((item) => {
    return String(item.id) === req.params.id;
  });

  if (!producto) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }

  const { nombre, categoria, descripcion, precio, imagen } = req.body;

  if (nombre) producto.nombre = nombre;
  if (categoria) producto.categoria = categoria;
  if (descripcion) producto.descripcion = descripcion;
  if (precio !== undefined) producto.precio = Number(precio);
  if (imagen !== undefined) producto.imagen = imagen;

  res.status(200).json(producto);
});

app.delete("/api/productos/:id", (req, res) => {
  const indice = productos.findIndex((item) => {
    return String(item.id) === req.params.id;
  });

  if (indice === -1) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }

  const productoEliminado = productos.splice(indice, 1);

  res.status(200).json({ mensaje: "Producto eliminado", producto: productoEliminado[0] });
});

app.get("/api/pedidos", (req, res) => {
  res.status(200).json(pedidos);
});

app.post("/api/pedidos", (req, res) => {
  const { nombre, correo, telefono, producto, cantidad, mensaje } = req.body;

  if (!nombre || !correo || !telefono || !producto || !cantidad) {
    return res.status(400).json({ mensaje: "Faltan datos del pedido" });
  }

  const nuevoPedido = {
    id: Date.now().toString(),
    nombre,
    correo,
    telefono,
    producto,
    cantidad: Number(cantidad),
    mensaje: mensaje || "",
    estado: "pendiente"
  };

  pedidos.push(nuevoPedido);

  res.status(201).json({ mensaje: "Pedido recibido", pedido: nuevoPedido });
});

app.put("/api/pedidos/:id", (req, res) => {
  const pedido = pedidos.find((item) => {
    return item.id === req.params.id;
  });

  if (!pedido) {
    return res.status(404).json({ mensaje: "Pedido no encontrado" });
  }

  if (req.body.estado !== "pendiente" && req.body.estado !== "atendido") {
    return res.status(400).json({ mensaje: "El estado debe ser pendiente o atendido" });
  }

  pedido.estado = req.body.estado;

  res.status(200).json(pedido);
});

app.delete("/api/pedidos/:id", (req, res) => {
  const indice = pedidos.findIndex((item) => {
    return item.id === req.params.id;
  });

  if (indice === -1) {
    return res.status(404).json({ mensaje: "Pedido no encontrado" });
  }

  const pedidoEliminado = pedidos.splice(indice, 1);

  res.status(200).json({ mensaje: "Pedido eliminado", pedido: pedidoEliminado[0] });
});



app.get("/", (req, res) => {
  res.send("Servidor de Kombechi funcionando");
});

app.listen(puerto, () => {
  console.log("Servidor listo en http://localhost:" + puerto);
});
