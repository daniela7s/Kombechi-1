
const mongoose = require("mongoose");
const Order = require("../models/Order");
const enviarNotificacionPedido = require("../config/mailer");

const obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await Order.find();
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los pedidos" });
  }
};

const crearPedido = async (req, res) => {
  const { nombre, correo, telefono, producto, cantidad, mensaje = "" } = req.body || {};

  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    String(correo || "").trim()
  );

  if (!correoValido) {
    return res.status(400).json({ mensaje: "Escribe un correo electrónico válido" });
  }

  try {
    // Crear y guardar el pedido en MongoDB.
    const nuevoPedido = new Order({
      nombre,
      correo,
      telefono,
      producto,
      cantidad,
      mensaje
    });

    const pedidoGuardado = await nuevoPedido.save();

    // Enviar notificación por correo.
    try {
      await enviarNotificacionPedido(pedidoGuardado);
      console.log("Correo enviado correctamente.");
    } catch (errorCorreo) {
      console.error("Error al enviar el correo:", errorCorreo.message);
    }

    // Responder al frontend.
    res.status(201).json({
      mensaje: "Pedido recibido",
      pedido: pedidoGuardado
    });

  } catch (error) {
    res.status(400).json({ mensaje: "No se pudo crear el pedido" });
  }
};

const actualizarEstadoPedido = async (req, res) => {
  const { estado } = req.body || {};
  const estadosPermitidos = ["pendiente", "atendido"];

  if (!estadosPermitidos.includes(estado)) {
    return res.status(400).json({ mensaje: "El estado debe ser pendiente o atendido" });
  }

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ mensaje: "El id del pedido no es válido" });
  }

  try {
    const pedido = await Order.findById(req.params.id);

    if (!pedido) {
      return res.status(404).json({ mensaje: "Pedido no encontrado" });
    }

    pedido.estado = estado;
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
