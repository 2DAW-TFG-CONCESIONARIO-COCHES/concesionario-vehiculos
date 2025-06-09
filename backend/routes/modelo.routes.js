const express = require("express")
const router = express.Router()
const modeloController = require("../controllers/modelo.controller")
const { verifyToken, isAdmin } = require("../middleware/auth.middleware")

// Rutas para modelos
router.get("/", modeloController.findAll)
router.get("/:id", modeloController.findOne)
router.get("/marca/:marcaId", modeloController.findByMarca)
router.post("/", [verifyToken], modeloController.create) // Empleados pueden crear
router.put("/:id", [verifyToken], modeloController.update) // Empleados pueden actualizar
router.delete("/:id", [verifyToken, isAdmin], modeloController.delete) // Solo admin puede eliminar

module.exports = router
