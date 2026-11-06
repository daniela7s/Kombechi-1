const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const verificarAdmin = require("../middleware/verificarAdmin");

router.use(verificarAdmin);

router.post("/", usersController.crearUsuario);
router.get("/", usersController.obtenerUsuarios);
router.get("/:id", usersController.obtenerUsuario);
router.put("/:id", usersController.actualizarUsuario);
router.delete("/:id", usersController.eliminarUsuario);

module.exports = router;
