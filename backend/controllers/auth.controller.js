const jwt = require("jsonwebtoken")
const Usuario = require("../models/usuario.model")

// Registro de usuario
exports.signup = async (req, res) => {
  try {
    console.log("Datos recibidos para registro:", req.body) // Para debug

    const { nombre, apellidos, email, password } = req.body

    // Validaciones básicas
    if (!nombre || !apellidos || !email || !password) {
      console.log("Faltan campos obligatorios") // Para debug
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      })
    }

    // Verificar si el email ya existe
    const existingUser = await Usuario.findOne({ where: { email: email.trim().toLowerCase() } })
    if (existingUser) {
      console.log("Email ya existe:", email) // Para debug
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
      rol: "empleado", // Siempre empleado para registros públicos
    })

    console.log("Usuario creado exitosamente:", usuario.id) // Para debug

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

    if (error.name === "SequelizeConnectionError") {
      return res.status(500).json({
        message: "Error de conexión a la base de datos",
      })
    }

    res.status(500).json({
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

// Inicio de sesión
exports.signin = async (req, res) => {
  try {
    console.log("Intento de login para:", req.body.email) // Para debug

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
      console.log("Usuario no encontrado:", email) // Para debug
      return res.status(401).json({
        message: "Credenciales incorrectas",
      })
    }

    // Verificar contraseña
    const passwordValida = await usuario.comparePassword(password)

    if (!passwordValida) {
      console.log("Contraseña incorrecta para:", email) // Para debug
      return res.status(401).json({
        message: "Credenciales incorrectas",
      })
    }

    // Generar token
    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })

    console.log("Login exitoso para:", email) // Para debug

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
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
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
