const jwt = require("jsonwebtoken");

const verificarAdmin = (req, res, next) => {
  const autorizacion = req.headers.authorization;

  if (!autorizacion || !autorizacion.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "Inicia sesión para continuar" });
  }

  const token = autorizacion.split(" ")[1];

  try {
    const datosAdmin = jwt.verify(token, process.env.JWT_SECRET);

    if (datosAdmin.rol !== "admin") {
      return res.status(401).json({ mensaje: "La sesión no es válida o ha vencido" });
    }

    req.admin = datosAdmin;
    next();
  } catch (error) {
    res.status(401).json({ mensaje: "La sesión no es válida o ha vencido" });
  }
};

module.exports = verificarAdmin;
