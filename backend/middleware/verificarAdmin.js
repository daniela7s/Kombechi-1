const jwt = require("jsonwebtoken");

const verificarAdmin = (req, res, next) => {
  const autorizacion = req.headers.authorization;

  if (!autorizacion || !autorizacion.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "Inicia sesión para continuar" });
  }

  const token = autorizacion.split(" ")[1];

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ mensaje: "La sesión no es válida o ha vencido" });
  }
};

module.exports = verificarAdmin;
