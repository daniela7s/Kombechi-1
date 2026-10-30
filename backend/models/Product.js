const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  categoria: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  moneda: {
    type: String,
    default: "COP"
  },
  imagen: {
    type: String,
    default: ""
  },
  destacado: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Product", productoSchema, "Products");
