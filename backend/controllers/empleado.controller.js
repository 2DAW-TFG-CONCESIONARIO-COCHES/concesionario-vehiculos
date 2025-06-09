const Usuario = require("../models/usuario.model")

// Obtener todos los empleados (solo para admin)
exports.findAll = async (req, res) => {
  try {
    const empleados = await Usuario.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    })
    res.status(200).json(empleados)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Obtener un empleado por ID (solo para admin)
exports.findOne = async (req, res) => {
  try {
    const empleado = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    })

    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" })
    }

    res.status(200).json(empleado)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Crear un nuevo empleado (solo para admin)
exports.create = async (req, res) => {
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

    // Solo admin puede crear otros admins
    const rolFinal = rol === "admin" ? "admin" : "empleado"

    const empleado = await Usuario.create({
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      email: email.trim().toLowerCase(),
      password,
      rol: rolFinal,
    })

    res.status(201).json({
      message: "Empleado creado correctamente",
      empleado: {
        id: empleado.id,
        nombre: empleado.nombre,
        apellidos: empleado.apellidos,
        email: empleado.email,
        rol: empleado.rol,
      },
    })
  } catch (error) {
    console.error("Error al crear empleado:", error)

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

// Actualizar un empleado (solo para admin)
exports.update = async (req, res) => {
  try {
    const empleado = await Usuario.findByPk(req.params.id)

    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" })
    }

    // No permitir que un admin se quite a sí mismo el rol de admin
    if (empleado.id === req.userId && req.body.rol === "empleado") {
      return res.status(400).json({
        message: "No puedes cambiar tu propio rol de administrador",
      })
    }

    const { nombre, apellidos, email, rol } = req.body

    await empleado.update({
      nombre: nombre || empleado.nombre,
      apellidos: apellidos || empleado.apellidos,
      email: email || empleado.email,
      rol: rol || empleado.rol,
    })

    res.status(200).json({
      message: "Empleado actualizado correctamente",
      empleado: {
        id: empleado.id,
        nombre: empleado.nombre,
        apellidos: empleado.apellidos,
        email: empleado.email,
        rol: empleado.rol,
      },
    })
  } catch (error) {
    console.error("Error al actualizar empleado:", error)
    res.status(500).json({ message: error.message })
  }
}

// Eliminar un empleado (solo para admin)
exports.delete = async (req, res) => {
  try {
    const empleado = await Usuario.findByPk(req.params.id)

    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" })
    }

    // No permitir que un admin se pueda eliminar a sí mismo
    if (empleado.id === req.userId) {
      return res.status(400).json({
        message: "No puedes eliminar tu propia cuenta",
      })
    }

    await empleado.destroy()

    res.status(200).json({ message: "Empleado eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar empleado:", error)
    res.status(500).json({ message: error.message })
  }
}

// Cambiar contraseña de un empleado (solo para admin)
exports.changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        message: "La nueva contraseña debe tener al menos 6 caracteres",
      })
    }

    const empleado = await Usuario.findByPk(req.params.id)

    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" })
    }

    await empleado.update({ password: newPassword })

    res.status(200).json({ message: "Contraseña actualizada correctamente" })
  } catch (error) {
    console.error("Error al cambiar contraseña:", error)
    res.status(500).json({ message: error.message })
  }
}
