const mongoose = require("mongoose");
const Product = require("../models/Product");

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
  try {
    const nuevoProducto = new Product(req.body);
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
