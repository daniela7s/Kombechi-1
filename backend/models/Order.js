const mongoose = require("mongoose");

const pedidoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  correo: {
    type: String,
    required: true,
    trim: true
  },
  telefono: {
    type: String,
    required: true,
    trim: true
  },
  producto: {
    type: String,
    required: true,
    trim: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1
  },
  mensaje: {
    type: String,
    default: ""
  },
  estado: {
    type: String,
    enum: ["pendiente", "atendido"],
    default: "pendiente"
  }
});

module.exports = mongoose.model("Order", pedidoSchema, "Orders");
