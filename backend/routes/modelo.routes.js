const express = require("express")
const router = express.Router()
const modeloController = require("../controllers/modelo.controller")
const { verifyToken, isAdmin } = require("../middleware/auth.middleware")

// Rutas para modelos
router.get("/", modeloController.findAll)
router.get("/:id", modeloController.findOne)
router.get("/marca/:marcaId", modeloController.findByMarca)
router.post("/", [verifyToken, isAdmin], modeloController.create)
router.put("/:id", [verifyToken, isAdmin], modeloController.update)
router.delete("/:id", [verifyToken, isAdmin], modeloController.delete)

module.exports = router
