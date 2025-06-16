const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth.controller")
const { verifyToken, isAdmin } = require("../middleware/auth.middleware")

// Rutas de autenticación
router.post("/signup", authController.signup)
router.post("/signin", authController.signin)
router.get("/profile", verifyToken, authController.profile)

// Rutas de administración de usuarios (solo para administradores)
router.post("/crear-usuario", [verifyToken, isAdmin], authController.crearUsuario)
router.get("/usuarios", [verifyToken, isAdmin], authController.getUsuarios)
router.delete("/usuarios/:id", [verifyToken, isAdmin], authController.deleteUsuario)

module.exports = router
