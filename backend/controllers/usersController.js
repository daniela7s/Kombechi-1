const mongoose = require("mongoose");
const Usuario = require("../models/User");

const crearUsuario = async (req, res) => {
  const { nombre, correo, telefono, direccion, intereses } = req.body || {};

  try {
    const usuario = await Usuario.create({
      nombre,
      correo,
      telefono,
      direccion,
      intereses
    });

    return res.status(201).json(usuario);
  } catch (error) {
    if (error.code === 11000 || error.name === "ValidationError") {
      return res.status(400).json({ mensaje: "No se pudo crear el usuario. Revisa los datos y que el correo no esté registrado." });
    }

    return res.status(500).json({ mensaje: "No se pudo crear el usuario." });
  }
};

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().sort({ nombre: 1 });
    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json({ mensaje: "No se pudieron consultar los usuarios." });
  }
};

const obtenerUsuario = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ mensaje: "El ID del usuario no es válido." });
  }

  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: "No se encontró el usuario." });
    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(500).json({ mensaje: "No se pudo consultar el usuario." });
  }
};

const actualizarUsuario = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ mensaje: "El ID del usuario no es válido." });
  }

  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: "No se encontró el usuario." });

    const campos = ["nombre", "correo", "telefono", "direccion", "intereses", "activo"];
    campos.forEach((campo) => {
      if (req.body?.[campo] !== undefined) usuario[campo] = req.body[campo];
    });

    await usuario.save();
    return res.status(200).json(usuario);
  } catch (error) {
    if (error.code === 11000 || error.name === "ValidationError") {
      return res.status(400).json({ mensaje: "No se pudo actualizar el usuario. Revisa los datos y que el correo no esté registrado." });
    }

    return res.status(500).json({ mensaje: "No se pudo actualizar el usuario." });
  }
};

const eliminarUsuario = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ mensaje: "El ID del usuario no es válido." });
  }

  try {
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true, runValidators: true }
    );
    if (!usuario) return res.status(404).json({ mensaje: "No se encontró el usuario." });
    return res.status(200).json({ mensaje: "Usuario marcado como inactivo.", usuario });
  } catch (error) {
    return res.status(500).json({ mensaje: "No se pudo desactivar el usuario." });
  }
};

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario
};

