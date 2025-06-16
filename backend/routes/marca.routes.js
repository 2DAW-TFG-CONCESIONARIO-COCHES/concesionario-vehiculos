const express = require("express")
const router = express.Router()
const marcaController = require("../controllers/marca.controller")
const { verifyToken, isAdmin } = require("../middleware/auth.middleware")

// Rutas para marcas
router.get("/", marcaController.findAll) // Público - cualquiera puede ver las marcas
router.get("/:id", marcaController.findOne) // Público - cualquiera puede ver una marca específica
router.post("/", [verifyToken, isAdmin], marcaController.create) // Solo admin puede crear
router.put("/:id", [verifyToken, isAdmin], marcaController.update) // Solo admin puede actualizar
router.delete("/:id", [verifyToken, isAdmin], marcaController.delete) // Solo admin puede eliminar

module.exports = router
