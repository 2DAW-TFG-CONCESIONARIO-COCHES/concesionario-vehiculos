const Usuario = require("../models/usuario.model")

// Obtener todos los usuarios (solo para admin)
exports.findAll = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    })
    res.status(200).json(usuarios)
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    res.status(500).json({ message: error.message })
  }
}

// Obtener un usuario por ID (solo para admin)
exports.findOne = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    })

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    res.status(200).json(usuario)
  } catch (error) {
    console.error("Error al obtener usuario:", error)
    res.status(500).json({ message: error.message })
  }
}

// Crear un nuevo usuario (solo para admin)
exports.create = async (req, res) => {
  try {
    const { nombre, apellidos, email, password, rol } = req.body

    // Validaciones básicas
    if (!nombre || !apellidos || !email || !password) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      })
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "El formato del email no es válido",
      })
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 6 caracteres",
      })
    }

    // Verificar si el email ya existe
    const existingUser = await Usuario.findOne({ where: { email: email.trim().toLowerCase() } })
    if (existingUser) {
      return res.status(400).json({
        message: "Ya existe un usuario con este email",
      })
    }

    // Solo admin puede crear otros admins
    const rolFinal = rol === "admin" ? "admin" : "empleado"

    const usuario = await Usuario.create({
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      email: email.trim().toLowerCase(),
      password,
      rol: rolFinal,
    })

    res.status(201).json({
      message: "Usuario creado correctamente",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rol: usuario.rol,
        createdAt: usuario.createdAt,
      },
    })
  } catch (error) {
    console.error("Error al crear usuario:", error)

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

// Actualizar un usuario (solo para admin)
exports.update = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id)

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    // No permitir que un admin se quite a sí mismo el rol de admin
    if (usuario.id === req.userId && req.body.rol === "empleado") {
      return res.status(400).json({
        message: "No puedes cambiar tu propio rol de administrador",
      })
    }

    // No permitir actualizar el email si ya existe otro usuario con ese email
    if (req.body.email && req.body.email !== usuario.email) {
      const existingUser = await Usuario.findOne({
        where: { email: req.body.email.trim().toLowerCase() },
      })
      if (existingUser) {
        return res.status(400).json({ message: "Ya existe un usuario con este email" })
      }
    }

    // Validar formato de email si se está actualizando
    if (req.body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({
          message: "El formato del email no es válido",
        })
      }
    }

    const { nombre, apellidos, email, rol } = req.body

    await usuario.update({
      nombre: nombre ? nombre.trim() : usuario.nombre,
      apellidos: apellidos ? apellidos.trim() : usuario.apellidos,
      email: email ? email.trim().toLowerCase() : usuario.email,
      rol: rol || usuario.rol,
    })

    // Devolver usuario actualizado sin contraseña
    const usuarioActualizado = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    })

    res.status(200).json({
      message: "Usuario actualizado correctamente",
      usuario: usuarioActualizado,
    })
  } catch (error) {
    console.error("Error al actualizar usuario:", error)
    res.status(500).json({ message: error.message })
  }
}

// Eliminar un usuario (solo para admin)
exports.delete = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id)

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    // No permitir que un admin se pueda eliminar a sí mismo
    if (usuario.id === req.userId) {
      return res.status(400).json({
        message: "No puedes eliminar tu propia cuenta",
      })
    }

    // No permitir eliminar el último administrador
    if (usuario.rol === "admin") {
      const adminCount = await Usuario.count({ where: { rol: "admin" } })
      if (adminCount <= 1) {
        return res.status(400).json({
          message: "No se puede eliminar el último administrador del sistema",
        })
      }
    }

    await usuario.destroy()

    res.status(200).json({ message: "Usuario eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar usuario:", error)
    res.status(500).json({ message: error.message })
  }
}

// Actualizar rol de usuario (solo para admin)
exports.updateRole = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id)

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    const { rol } = req.body

    if (!rol || !["admin", "empleado"].includes(rol)) {
      return res.status(400).json({ message: "Rol no válido. Debe ser 'admin' o 'empleado'" })
    }

    // No permitir que un admin se quite a sí mismo el rol de admin
    if (usuario.id === req.userId && rol === "empleado") {
      return res.status(400).json({
        message: "No puedes cambiar tu propio rol de administrador",
      })
    }

    // Si se está cambiando de admin a empleado, verificar que no sea el último admin
    if (usuario.rol === "admin" && rol === "empleado") {
      const adminCount = await Usuario.count({ where: { rol: "admin" } })
      if (adminCount <= 1) {
        return res.status(400).json({
          message: "No se puede cambiar el rol del último administrador del sistema",
        })
      }
    }

    await usuario.update({ rol })

    // Devolver usuario sin contraseña
    const usuarioActualizado = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    })

    res.status(200).json({
      message: "Rol actualizado correctamente",
      usuario: usuarioActualizado,
    })
  } catch (error) {
    console.error("Error al actualizar rol:", error)
    res.status(500).json({ message: error.message })
  }
}

// Cambiar contraseña de un usuario (solo para admin)
exports.changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        message: "La nueva contraseña debe tener al menos 6 caracteres",
      })
    }

    const usuario = await Usuario.findByPk(req.params.id)

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    await usuario.update({ password: newPassword })

    res.status(200).json({
      message: "Contraseña actualizada correctamente",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        email: usuario.email,
      },
    })
  } catch (error) {
    console.error("Error al cambiar contraseña:", error)
    res.status(500).json({ message: error.message })
  }
}

// Obtener estadísticas de usuarios (solo para admin)
exports.getStats = async (req, res) => {
  try {
    const totalUsuarios = await Usuario.count()
    const totalAdmins = await Usuario.count({ where: { rol: "admin" } })
    const totalEmpleados = await Usuario.count({ where: { rol: "empleado" } })

    // Usuarios registrados en los últimos 30 días
    const fechaLimite = new Date()
    fechaLimite.setDate(fechaLimite.getDate() - 30)

    const usuariosRecientes = await Usuario.count({
      where: {
        createdAt: {
          [require("sequelize").Op.gte]: fechaLimite,
        },
      },
    })

    res.status(200).json({
      totalUsuarios,
      totalAdmins,
      totalEmpleados,
      usuariosRecientes,
      porcentajeAdmins: totalUsuarios > 0 ? ((totalAdmins / totalUsuarios) * 100).toFixed(1) : 0,
      porcentajeEmpleados: totalUsuarios > 0 ? ((totalEmpleados / totalUsuarios) * 100).toFixed(1) : 0,
    })
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    res.status(500).json({ message: error.message })
  }
}
