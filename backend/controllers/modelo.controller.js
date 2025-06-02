const Modelo = require("../models/modelo.model")
const Marca = require("../models/marca.model")

// Obtener todos los modelos
exports.findAll = async (req, res) => {
  try {
    const modelos = await Modelo.findAll({
      include: [{ model: Marca, attributes: ["id", "nombre"] }],
    })
    res.status(200).json(modelos)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Obtener un modelo por ID
exports.findOne = async (req, res) => {
  try {
    const modelo = await Modelo.findByPk(req.params.id, {
      include: [{ model: Marca, attributes: ["id", "nombre"] }],
    })

    if (!modelo) {
      return res.status(404).json({ message: "Modelo no encontrado" })
    }

    res.status(200).json(modelo)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Crear un nuevo modelo
exports.create = async (req, res) => {
  try {
    // Verificar si la marca existe
    const marca = await Marca.findByPk(req.body.marcaId)

    if (!marca) {
      return res.status(404).json({ message: "Marca no encontrada" })
    }

    const modelo = await Modelo.create({
      nombre: req.body.nombre,
      anio: req.body.anio,
      tipo: req.body.tipo,
      marcaId: req.body.marcaId,
    })

    res.status(201).json(modelo)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Actualizar un modelo
exports.update = async (req, res) => {
  try {
    const modelo = await Modelo.findByPk(req.params.id)

    if (!modelo) {
      return res.status(404).json({ message: "Modelo no encontrado" })
    }

    // Si se proporciona marcaId, verificar que la marca existe
    if (req.body.marcaId) {
      const marca = await Marca.findByPk(req.body.marcaId)

      if (!marca) {
        return res.status(404).json({ message: "Marca no encontrada" })
      }
    }

    await modelo.update({
      nombre: req.body.nombre || modelo.nombre,
      anio: req.body.anio || modelo.anio,
      tipo: req.body.tipo || modelo.tipo,
      marcaId: req.body.marcaId || modelo.marcaId,
    })

    res.status(200).json(modelo)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Eliminar un modelo
exports.delete = async (req, res) => {
  try {
    const modelo = await Modelo.findByPk(req.params.id)

    if (!modelo) {
      return res.status(404).json({ message: "Modelo no encontrado" })
    }

    await modelo.destroy()

    res.status(200).json({ message: "Modelo eliminado correctamente" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Obtener modelos por marca
exports.findByMarca = async (req, res) => {
  try {
    const modelos = await Modelo.findAll({
      where: { marcaId: req.params.marcaId },
      include: [{ model: Marca, attributes: ["id", "nombre"] }],
    })

    res.status(200).json(modelos)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
