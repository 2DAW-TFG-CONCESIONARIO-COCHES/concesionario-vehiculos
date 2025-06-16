const Marca = require("../models/marca.model")

// Obtener todas las marcas
exports.findAll = async (req, res) => {
  try {
    const marcas = await Marca.findAll({
      order: [["createdAt", "DESC"]],
    })
    res.status(200).json(marcas)
  } catch (error) {
    console.error("Error al obtener marcas:", error)
    res.status(500).json({
      message: "Error al obtener las marcas",
      error: process.env.NODE_ENV === "development" ? error.message : "Error interno del servidor",
    })
  }
}

// Obtener una marca por ID
exports.findOne = async (req, res) => {
  try {
    const marca = await Marca.findByPk(req.params.id)

    if (!marca) {
      return res.status(404).json({ message: "Marca no encontrada" })
    }

    res.status(200).json(marca)
  } catch (error) {
    console.error("Error al obtener marca:", error)
    res.status(500).json({
      message: "Error al obtener la marca",
      error: process.env.NODE_ENV === "development" ? error.message : "Error interno del servidor",
    })
  }
}

// Crear una nueva marca
exports.create = async (req, res) => {
  try {
    console.log("Datos recibidos para crear marca:", req.body)
    console.log("Usuario autenticado:", req.userId)

    const { nombre, pais, logo } = req.body

    // Validaciones básicas
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({
        message: "El nombre de la marca es obligatorio",
      })
    }

    // Verificar si ya existe una marca con ese nombre
    const existingMarca = await Marca.findOne({
      where: { nombre: nombre.trim() },
    })

    if (existingMarca) {
      return res.status(400).json({
        message: "Ya existe una marca con ese nombre",
      })
    }

    const marca = await Marca.create({
      nombre: nombre.trim(),
      pais: pais ? pais.trim() : null,
      logo: logo ? logo.trim() : null,
    })

    console.log("Marca creada exitosamente:", marca.toJSON())

    res.status(201).json({
      message: "Marca creada correctamente",
      marca: marca,
    })
  } catch (error) {
    console.error("Error al crear marca:", error)

    // Manejar errores específicos de Sequelize
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Datos de entrada no válidos",
        errors: error.errors.map((err) => err.message),
      })
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Ya existe una marca con ese nombre",
      })
    }

    res.status(500).json({
      message: "Error interno del servidor al crear la marca",
      error: process.env.NODE_ENV === "development" ? error.message : "Error interno del servidor",
    })
  }
}

// Actualizar una marca
exports.update = async (req, res) => {
  try {
    console.log("Datos recibidos para actualizar marca:", req.body)
    console.log("ID de marca a actualizar:", req.params.id)
    console.log("Usuario autenticado:", req.userId)

    const marca = await Marca.findByPk(req.params.id)

    if (!marca) {
      return res.status(404).json({ message: "Marca no encontrada" })
    }

    const { nombre, pais, logo } = req.body

    // Validar nombre si se está actualizando
    if (nombre && nombre.trim() === "") {
      return res.status(400).json({
        message: "El nombre de la marca no puede estar vacío",
      })
    }

    // Verificar si el nuevo nombre ya existe (solo si se está cambiando)
    if (nombre && nombre.trim() !== marca.nombre) {
      const existingMarca = await Marca.findOne({
        where: { nombre: nombre.trim() },
      })

      if (existingMarca) {
        return res.status(400).json({
          message: "Ya existe una marca con ese nombre",
        })
      }
    }

    await marca.update({
      nombre: nombre ? nombre.trim() : marca.nombre,
      pais: pais !== undefined ? (pais ? pais.trim() : null) : marca.pais,
      logo: logo !== undefined ? (logo ? logo.trim() : null) : marca.logo,
    })

    console.log("Marca actualizada exitosamente:", marca.toJSON())

    res.status(200).json({
      message: "Marca actualizada correctamente",
      marca: marca,
    })
  } catch (error) {
    console.error("Error al actualizar marca:", error)

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Datos de entrada no válidos",
        errors: error.errors.map((err) => err.message),
      })
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Ya existe una marca con ese nombre",
      })
    }

    res.status(500).json({
      message: "Error interno del servidor al actualizar la marca",
      error: process.env.NODE_ENV === "development" ? error.message : "Error interno del servidor",
    })
  }
}

// Eliminar una marca
exports.delete = async (req, res) => {
  try {
    console.log("ID de marca a eliminar:", req.params.id)
    console.log("Usuario autenticado:", req.userId)

    const marca = await Marca.findByPk(req.params.id)

    if (!marca) {
      return res.status(404).json({ message: "Marca no encontrada" })
    }

    // Verificar si la marca tiene modelos asociados
    const Modelo = require("../models/modelo.model")
    const modelosAsociados = await Modelo.count({ where: { marcaId: req.params.id } })

    if (modelosAsociados > 0) {
      return res.status(400).json({
        message: `No se puede eliminar la marca porque tiene ${modelosAsociados} modelo(s) asociado(s). Elimina primero los modelos.`,
      })
    }

    await marca.destroy()

    console.log("Marca eliminada exitosamente:", marca.nombre)

    res.status(200).json({
      message: "Marca eliminada correctamente",
      marca: {
        id: marca.id,
        nombre: marca.nombre,
      },
    })
  } catch (error) {
    console.error("Error al eliminar marca:", error)
    res.status(500).json({
      message: "Error interno del servidor al eliminar la marca",
      error: process.env.NODE_ENV === "development" ? error.message : "Error interno del servidor",
    })
  }
}
