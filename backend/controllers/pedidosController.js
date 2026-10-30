const mongoose = require("mongoose");
const Order = require("../models/Order");

const obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await Order.find();
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los pedidos" });
  }
};

const crearPedido = async (req, res) => {
  try {
    const nuevoPedido = new Order(req.body);
    const pedidoGuardado = await nuevoPedido.save();
    res.status(201).json({ mensaje: "Pedido recibido", pedido: pedidoGuardado });
  } catch (error) {
    res.status(400).json({ mensaje: "No se pudo crear el pedido" });
  }
};

const actualizarEstadoPedido = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ mensaje: "El id del pedido no es válido" });
  }

  try {
    const pedido = await Order.findById(req.params.id);

    if (!pedido) {
      return res.status(404).json({ mensaje: "Pedido no encontrado" });
    }

    pedido.estado = req.body.estado;
    const pedidoActualizado = await pedido.save();
    res.status(200).json(pedidoActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: "No se pudo actualizar el pedido" });
  }
};

const eliminarPedido = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ mensaje: "El id del pedido no es válido" });
  }

  try {
    const pedido = await Order.findByIdAndDelete(req.params.id);

    if (!pedido) {
      return res.status(404).json({ mensaje: "Pedido no encontrado" });
    }

    res.status(200).json({ mensaje: "Pedido eliminado", pedido });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el pedido" });
  }
};

module.exports = {
  obtenerPedidos,
  crearPedido,
  actualizarEstadoPedido,
  eliminarPedido
};
