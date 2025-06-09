const express = require("express")
const router = express.Router()
const marcaController = require("../controllers/marca.controller")
const { verifyToken, isAdmin } = require("../middleware/auth.middleware")

// Rutas para marcas
router.get("/", marcaController.findAll)
router.get("/:id", marcaController.findOne)
router.post("/", [verifyToken], marcaController.create) // Empleados pueden crear
router.put("/:id", [verifyToken], marcaController.update) // Empleados pueden actualizar
router.delete("/:id", [verifyToken, isAdmin], marcaController.delete) // Solo admin puede eliminar

module.exports = router
