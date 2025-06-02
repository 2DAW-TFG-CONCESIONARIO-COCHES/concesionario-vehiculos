const jwt = require("jsonwebtoken")
const Usuario = require("../models/usuario.model")

// Registro de usuario
exports.signup = async (req, res) => {
  try {
    // Crear usuario
    const usuario = await Usuario.create({
      nombre: req.body.nombre,
      apellidos: req.body.apellidos,
      email: req.body.email,
      password: req.body.password,
      rol: req.body.rol || "empleado",
    })

    res.status(201).json({
      message: "Usuario registrado correctamente",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rol: usuario.rol,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Inicio de sesión
exports.signin = async (req, res) => {
  try {
    // Buscar usuario por email
    const usuario = await Usuario.findOne({ where: { email: req.body.email } })

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    // Verificar contraseña
    const passwordValida = await usuario.comparePassword(req.body.password)

    if (!passwordValida) {
      return res.status(401).json({ message: "Contraseña incorrecta" })
    }

    // Generar token
    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rol: usuario.rol,
      },
      token,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Obtener perfil de usuario
exports.profile = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.userId, {
      attributes: { exclude: ["password"] },
    })

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    res.status(200).json(usuario)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
