const express = require("express")
const router = express.Router()
const vehiculoController = require("../controllers/vehiculo.controller")
const { verifyToken, isAdmin } = require("../middleware/auth.middleware")

// Rutas para vehículos
router.get("/", vehiculoController.findAll)
router.get("/search", vehiculoController.search)
router.get("/:id", vehiculoController.findOne)
router.post("/", [verifyToken], vehiculoController.create)
router.put("/:id", [verifyToken], vehiculoController.update)
router.delete("/:id", [verifyToken, isAdmin], vehiculoController.delete)

module.exports = router