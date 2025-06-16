const jwt = require("jsonwebtoken")
const Usuario = require("../models/usuario.model")

// Registro de usuario
exports.signup = async (req, res) => {
  try {
    const { nombre, apellidos, email, password, rol } = req.body

    // Validaciones básicas
    if (!nombre || !apellidos || !email || !password) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      })
    }

    // Verificar si el email ya existe
    const existingUser = await Usuario.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({
        message: "Ya existe un usuario con este email",
      })
    }

    // Crear usuario
    const usuario = await Usuario.create({
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      email: email.trim().toLowerCase(),
      password,
      rol: rol || "empleado",
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
    console.error("Error en signup:", error)

    // Manejar errores específicos de Sequelize
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Datos de entrada no válidos",
        errors: error.errors.map((err) => err.message),
      })
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Ya existe un usuario con este email",
      })
    }

    res.status(500).json({
      message: "Error interno del servidor",
    })
  }
}

// Inicio de sesión
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({
        message: "Email y contraseña son obligatorios",
      })
    }

    // Buscar usuario por email
    const usuario = await Usuario.findOne({
      where: { email: email.trim().toLowerCase() },
    })

    if (!usuario) {
      console.log(`Intento de inicio de sesión fallido: usuario con email ${email} no encontrado`)
      return res.status(401).json({
        message: "Credenciales incorrectas",
      })
    }

    // Verificar contraseña
    const passwordValida = await usuario.comparePassword(password)

    if (!passwordValida) {
      console.log(`Intento de inicio de sesión fallido: contraseña incorrecta para ${email}`)
      return res.status(401).json({
        message: "Credenciales incorrectas",
      })
    }

    // Generar token
    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })

    console.log(`Inicio de sesión exitoso para ${email}`)

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
    console.error("Error en signin:", error)
    res.status(500).json({
      message: "Error interno del servidor",
    })
  }
}

// Obtener perfil de usuario
exports.profile = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.userId, {
      attributes: { exclude: ["password"] },
    })

    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      })
    }

    res.status(200).json(usuario)
  } catch (error) {
    console.error("Error en profile:", error)
    res.status(500).json({
      message: "Error interno del servidor",
    })
  }
}

// Crear usuario (solo para administradores)
exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, apellidos, email, password, rol } = req.body

    // Validaciones básicas
    if (!nombre || !apellidos || !email || !password) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      })
    }

    // Verificar si el email ya existe
    const existingUser = await Usuario.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({
        message: "Ya existe un usuario con este email",
      })
    }

    // Crear usuario
    const usuario = await Usuario.create({
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      email: email.trim().toLowerCase(),
      password,
      rol: rol || "empleado",
    })

    res.status(201).json({
      message: "Usuario creado correctamente",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rol: usuario.rol,
      },
    })
  } catch (error) {
    console.error("Error al crear usuario:", error)
    res.status(500).json({
      message: "Error interno del servidor",
    })
  }
}

// Obtener todos los usuarios (solo para administradores)
exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    })

    res.status(200).json(usuarios)
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    res.status(500).json({
      message: "Error interno del servidor",
    })
  }
}

// Eliminar usuario (solo para administradores)
exports.deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params

    // Verificar que el usuario existe
    const usuario = await Usuario.findByPk(id)
    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      })
    }

    // No permitir eliminar al propio usuario
    if (usuario.id === req.userId) {
      return res.status(400).json({
        message: "No puedes eliminar tu propio usuario",
      })
    }

    await usuario.destroy()

    res.status(200).json({
      message: "Usuario eliminado correctamente",
    })
  } catch (error) {
    console.error("Error al eliminar usuario:", error)
    res.status(500).json({
      message: "Error interno del servidor",
    })
  }
}
