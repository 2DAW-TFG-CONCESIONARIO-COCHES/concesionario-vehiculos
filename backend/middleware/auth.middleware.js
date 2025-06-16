const jwt = require("jsonwebtoken")
const Usuario = require("../models/usuario.model")

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"]

  if (!token) {
    console.log("No se proporcionó token de autenticación")
    return res.status(403).json({ message: "No se proporcionó token de autenticación" })
  }

  // Remover 'Bearer ' si está presente
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length)
  }

  try {
    console.log("Verificando token:", token.substring(0, 20) + "...")
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log("Token decodificado:", { id: decoded.id, rol: decoded.rol })
    req.userId = decoded.id
    req.userRole = decoded.rol
    next()
  } catch (error) {
    console.error("Error al verificar token:", error.message)
    return res.status(401).json({ message: "Token no válido o expirado" })
  }
}

const isAdmin = async (req, res, next) => {
  try {
    console.log("Verificando rol de admin para usuario:", req.userId)

    const usuario = await Usuario.findByPk(req.userId)

    if (!usuario) {
      console.log("Usuario no encontrado:", req.userId)
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    console.log("Rol del usuario:", usuario.rol)

    if (usuario.rol !== "admin") {
      console.log("Usuario no es admin:", usuario.rol)
      return res.status(403).json({ message: "Requiere rol de administrador" })
    }

    console.log("Usuario verificado como admin")
    next()
  } catch (error) {
    console.error("Error al verificar rol de admin:", error)
    return res.status(500).json({ message: "Error interno del servidor" })
  }
}

module.exports = {
  verifyToken,
  isAdmin,
}
