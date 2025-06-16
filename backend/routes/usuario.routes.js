const express = require("express")
const router = express.Router()
const usuarioController = require("../controllers/usuario.controller")
const { verifyToken, isAdmin } = require("../middleware/auth.middleware")

// Rutas para usuarios (solo admin)
router.get("/", [verifyToken, isAdmin], usuarioController.findAll)
router.get("/stats", [verifyToken, isAdmin], usuarioController.getStats)
router.get("/:id", [verifyToken, isAdmin], usuarioController.findOne)
router.post("/", [verifyToken, isAdmin], usuarioController.create)
router.put("/:id", [verifyToken, isAdmin], usuarioController.update)
router.delete("/:id", [verifyToken, isAdmin], usuarioController.delete)
router.put("/:id/role", [verifyToken, isAdmin], usuarioController.updateRole)
router.put("/:id/password", [verifyToken, isAdmin], usuarioController.changePassword)

module.exports = router
