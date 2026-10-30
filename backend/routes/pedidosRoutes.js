const express = require("express");
const router = express.Router();
const pedidosController = require("../controllers/pedidosController");
const verificarAdmin = require("../middleware/verificarAdmin");

router.get("/", verificarAdmin, pedidosController.obtenerPedidos);
router.post("/", pedidosController.crearPedido);
router.put("/:id", verificarAdmin, pedidosController.actualizarEstadoPedido);
router.delete("/:id", verificarAdmin, pedidosController.eliminarPedido);

module.exports = router;
