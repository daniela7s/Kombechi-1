const mongoose = require("mongoose");
const Product = require("../models/Product");

function datosProductoValidos(datos = {}) {
  return typeof datos.nombre === "string" &&
    datos.nombre.trim().length > 0 && datos.nombre.length <= 70 &&
    ["Kombucha", "Kéfir"].includes(datos.categoria) &&
    String(datos.precio ?? "").trim() !== "" &&
    Number.isFinite(Number(datos.precio)) && Number(datos.precio) >= 0 &&
    typeof datos.descripcion === "string" &&
    datos.descripcion.trim().length > 0 && datos.descripcion.length <= 400 &&
    (datos.imagen === undefined || (typeof datos.imagen === "string" && datos.imagen.length <= 500)) &&
    (datos.destacado === undefined || typeof datos.destacado === "boolean");
}

const obtenerProductos = async (req, res) => {
  try {
    const productos = await Product.find();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los productos" });
  }
};

const obtenerProducto = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ mensaje: "El id del producto no es válido" });
  }

  try {
    const producto = await Product.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el producto" });
  }
};

const crearProducto = async (req, res) => {
  const { nombre, categoria, descripcion, precio, imagen = "", destacado = false } = req.body || {};

  if (!datosProductoValidos(req.body)) {
    return res.status(400).json({ mensaje: "Revisa el nombre, la categoría, el precio y la descripción del producto" });
  }

  try {
    const nuevoProducto = new Product({
      nombre: nombre.trim(),
      categoria,
      descripcion: descripcion.trim(),
      precio: Number(precio),
      imagen: imagen.trim(),
      destacado
    });
    const productoGuardado = await nuevoProducto.save();
    res.status(201).json(productoGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: "No se pudo crear el producto" });
  }
};

const actualizarProducto = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ mensaje: "El id del producto no es válido" });
  }

  if (!datosProductoValidos(req.body)) {
    return res.status(400).json({ mensaje: "Revisa el nombre, la categoría, el precio y la descripción del producto" });
  }

  try {
    const producto = await Product.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    const campos = ["nombre", "categoria", "descripcion", "precio", "imagen", "destacado"];

    campos.forEach((campo) => {
      if (req.body[campo] !== undefined) {
        producto[campo] = req.body[campo];
      }
    });

    const productoActualizado = await producto.save();
    res.status(200).json(productoActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: "No se pudo actualizar el producto" });
  }
};

const eliminarProducto = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ mensaje: "El id del producto no es válido" });
  }

  try {
    const producto = await Product.findByIdAndDelete(req.params.id);

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.status(200).json({ mensaje: "Producto eliminado", producto });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el producto" });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};
