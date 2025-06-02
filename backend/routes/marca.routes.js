const express = require("express")
const router = express.Router()
const marcaController = require("../controllers/marca.controller")
const { verifyToken, isAdmin } = require("../middleware/auth.middleware")

// Rutas para marcas
router.get("/", marcaController.findAll)
router.get("/:id", marcaController.findOne)
router.post("/", [verifyToken, isAdmin], marcaController.create)
router.put("/:id", [verifyToken, isAdmin], marcaController.update)
router.delete("/:id", [verifyToken, isAdmin], marcaController.delete)

module.exports = router
