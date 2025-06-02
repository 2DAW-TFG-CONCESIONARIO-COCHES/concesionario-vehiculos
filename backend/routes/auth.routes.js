const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth.controller")
const { verifyToken } = require("../middleware/auth.middleware")

// Rutas de autenticación
router.post("/signup", authController.signup)
router.post("/signin", authController.signin)
router.get("/profile", verifyToken, authController.profile)

module.exports = router
