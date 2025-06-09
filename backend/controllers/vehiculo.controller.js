const Vehiculo = require("../models/vehiculo.model")
const Modelo = require("../models/modelo.model")
const Marca = require("../models/marca.model")
const { Op } = require("sequelize")

// Obtener todos los vehículos
exports.findAll = async (req, res) => {
  try {
    console.log("Obteniendo todos los vehículos...") // Para debug

    const vehiculos = await Vehiculo.findAll({
      include: [
        {
          model: Modelo,
          attributes: ["id", "nombre", "anio", "tipo"],
          include: [{ model: Marca, attributes: ["id", "nombre"] }],
        },
      ],
    })

    console.log(`Se encontraron ${vehiculos.length} vehículos`) // Para debug
    res.status(200).json(vehiculos)
  } catch (error) {
    console.error("Error al obtener vehículos:", error)
    res.status(500).json({ message: error.message })
  }
}

// Obtener un vehículo por ID
exports.findOne = async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findByPk(req.params.id, {
      include: [
        {
          model: Modelo,
          attributes: ["id", "nombre", "anio", "tipo"],
          include: [{ model: Marca, attributes: ["id", "nombre"] }],
        },
      ],
    })

    if (!vehiculo) {
      return res.status(404).json({ message: "Vehículo no encontrado" })
    }

    res.status(200).json(vehiculo)
  } catch (error) {
    console.error("Error al obtener vehículo:", error)
    res.status(500).json({ message: error.message })
  }
}

// Crear un nuevo vehículo
exports.create = async (req, res) => {
  try {
    // Verificar si el modelo existe
    const modelo = await Modelo.findByPk(req.body.modeloId)

    if (!modelo) {
      return res.status(404).json({ message: "Modelo no encontrado" })
    }

    const vehiculo = await Vehiculo.create({
      vin: req.body.vin,
      color: req.body.color,
      precio: req.body.precio,
      kilometraje: req.body.kilometraje,
      combustible: req.body.combustible,
      transmision: req.body.transmision,
      estado: req.body.estado,
      descripcion: req.body.descripcion,
      imagenes: req.body.imagenes,
      modeloId: req.body.modeloId,
    })

    res.status(201).json(vehiculo)
  } catch (error) {
    console.error("Error al crear vehículo:", error)
    res.status(500).json({ message: error.message })
  }
}

// Actualizar un vehículo
exports.update = async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findByPk(req.params.id)

    if (!vehiculo) {
      return res.status(404).json({ message: "Vehículo no encontrado" })
    }

    // Si se proporciona modeloId, verificar que el modelo existe
    if (req.body.modeloId) {
      const modelo = await Modelo.findByPk(req.body.modeloId)

      if (!modelo) {
        return res.status(404).json({ message: "Modelo no encontrado" })
      }
    }

    await vehiculo.update({
      vin: req.body.vin || vehiculo.vin,
      color: req.body.color || vehiculo.color,
      precio: req.body.precio || vehiculo.precio,
      kilometraje: req.body.kilometraje || vehiculo.kilometraje,
      combustible: req.body.combustible || vehiculo.combustible,
      transmision: req.body.transmision || vehiculo.transmision,
      estado: req.body.estado || vehiculo.estado,
      descripcion: req.body.descripcion || vehiculo.descripcion,
      imagenes: req.body.imagenes || vehiculo.imagenes,
      modeloId: req.body.modeloId || vehiculo.modeloId,
    })

    res.status(200).json(vehiculo)
  } catch (error) {
    console.error("Error al actualizar vehículo:", error)
    res.status(500).json({ message: error.message })
  }
}

// Eliminar un vehículo
exports.delete = async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findByPk(req.params.id)

    if (!vehiculo) {
      return res.status(404).json({ message: "Vehículo no encontrado" })
    }

    await vehiculo.destroy()

    res.status(200).json({ message: "Vehículo eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar vehículo:", error)
    res.status(500).json({ message: error.message })
  }
}

// Buscar vehículos por filtros
exports.search = async (req, res) => {
  try {
    const { marca, modelo, estado, combustible, transmision, precioMin, precioMax } = req.query

    const whereCondition = {}
    const includeCondition = [
      {
        model: Modelo,
        attributes: ["id", "nombre", "anio", "tipo"],
        include: [{ model: Marca, attributes: ["id", "nombre"] }],
      },
    ]

    // Filtrar por estado
    if (estado) {
      whereCondition.estado = estado
    }

    // Filtrar por combustible
    if (combustible) {
      whereCondition.combustible = combustible
    }

    // Filtrar por transmisión
    if (transmision) {
      whereCondition.transmision = transmision
    }

    // Filtrar por rango de precio
    if (precioMin && precioMax) {
      whereCondition.precio = {
        [Op.between]: [precioMin, precioMax],
      }
    } else if (precioMin) {
      whereCondition.precio = {
        [Op.gte]: precioMin,
      }
    } else if (precioMax) {
      whereCondition.precio = {
        [Op.lte]: precioMax,
      }
    }

    // Filtrar por marca y modelo
    if (marca) {
      includeCondition[0].include[0].where = { nombre: { [Op.like]: `%${marca}%` } }
    }

    if (modelo) {
      includeCondition[0].where = { nombre: { [Op.like]: `%${modelo}%` } }
    }

    const vehiculos = await Vehiculo.findAll({
      where: whereCondition,
      include: includeCondition,
    })

    res.status(200).json(vehiculos)
  } catch (error) {
    console.error("Error en búsqueda de vehículos:", error)
    res.status(500).json({ message: error.message })
  }
}
