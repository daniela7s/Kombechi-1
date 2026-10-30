const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const iniciarSesion = async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ mensaje: "Escribe usuario y contraseña" });
  }

  if (!process.env.ADMIN_USER || !process.env.ADMIN_PASSWORD_HASH || !process.env.JWT_SECRET) {
    return res.status(500).json({ mensaje: "Falta configurar el administrador en .env" });
  }

  if (usuario !== process.env.ADMIN_USER) {
    return res.status(401).json({ mensaje: "Usuario o contraseña incorrectos" });
  }

  try {
    const contraseñaCorrecta = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);

    if (!contraseñaCorrecta) {
      return res.status(401).json({ mensaje: "Usuario o contraseña incorrectos" });
    }

    const token = jwt.sign({ usuario }, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.status(200).json({ mensaje: "Inicio de sesión correcto", token });
  } catch (error) {
    res.status(500).json({ mensaje: "No se pudo iniciar sesión" });
  }
};

module.exports = { iniciarSesion };
