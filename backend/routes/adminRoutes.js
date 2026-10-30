const express = require("express");
const { rateLimit } = require("express-rate-limit");
const router = express.Router();
const adminController = require("../controllers/adminController");

const limiteLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { mensaje: "Demasiados intentos. Espera 15 minutos e inténtalo de nuevo." }
});

router.post("/login", limiteLogin, adminController.iniciarSesion);

module.exports = router;
