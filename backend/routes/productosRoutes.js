const express = require("express");
const router = express.Router();
const productosController = require("../controllers/productosController");
const verificarAdmin = require("../middleware/verificarAdmin");

router.get("/", productosController.obtenerProductos);
router.get("/:id", productosController.obtenerProducto);
router.post("/", verificarAdmin, productosController.crearProducto);
router.put("/:id", verificarAdmin, productosController.actualizarProducto);
router.delete("/:id", verificarAdmin, productosController.eliminarProducto);

module.exports = router;
