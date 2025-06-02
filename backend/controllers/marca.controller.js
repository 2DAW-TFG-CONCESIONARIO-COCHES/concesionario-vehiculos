const Marca = require("../models/marca.model")

// Obtener todas las marcas
exports.findAll = async (req, res) => {
  try {
    const marcas = await Marca.findAll()
    res.status(200).json(marcas)
  } catch (error) {
    res.status(500).json({ message: error.message })
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
    res.status(500).json({ message: error.message })
  }
}

// Crear una nueva marca
exports.create = async (req, res) => {
  try {
    const marca = await Marca.create({
      nombre: req.body.nombre,
      pais: req.body.pais,
      logo: req.body.logo,
    })

    res.status(201).json(marca)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Actualizar una marca
exports.update = async (req, res) => {
  try {
    const marca = await Marca.findByPk(req.params.id)

    if (!marca) {
      return res.status(404).json({ message: "Marca no encontrada" })
    }

    await marca.update({
      nombre: req.body.nombre || marca.nombre,
      pais: req.body.pais || marca.pais,
      logo: req.body.logo || marca.logo,
    })

    res.status(200).json(marca)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Eliminar una marca
exports.delete = async (req, res) => {
  try {
    const marca = await Marca.findByPk(req.params.id)

    if (!marca) {
      return res.status(404).json({ message: "Marca no encontrada" })
    }

    await marca.destroy()

    res.status(200).json({ message: "Marca eliminada correctamente" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
