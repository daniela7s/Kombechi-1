const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  correo: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  telefono: {
    type: String,
    required: true,
    trim: true
  },

  direccion: {
    direccionCompleta: {
      type: String,
      trim: true
    },
    ciudad: {
      type: String,
      trim: true
    },
    barrio: {
      type: String,
      trim: true
    }
  },

  intereses: {
    type: [String],
    default: []
  },

  activo: {
    type: Boolean,
    default: true
  },

});

module.exports = mongoose.model("User", UsuarioSchema, "Users");
