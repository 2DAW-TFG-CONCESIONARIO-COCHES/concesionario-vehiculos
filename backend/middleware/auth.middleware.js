const jwt = require("jsonwebtoken")
const Usuario = require("../models/usuario.model")

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"]

  if (!token) {
    return res.status(403).json({ message: "No se proporcionó token de autenticación" })
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch (error) {
    return res.status(401).json({ message: "Token no válido o expirado" })
  }
}

const isAdmin = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.userId)

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    if (usuario.rol !== "admin") {
      return res.status(403).json({ message: "Requiere rol de administrador" })
    }

    next()
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

module.exports = {
  verifyToken,
  isAdmin,
}
