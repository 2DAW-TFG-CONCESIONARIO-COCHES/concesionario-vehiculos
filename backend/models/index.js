const sequelize = require("../config/db.config")
const Usuario = require("./usuario.model")
const Marca = require("./marca.model")
const Modelo = require("./modelo.model")
const Vehiculo = require("./vehiculo.model")

// Definir relaciones
Marca.hasMany(Modelo, { foreignKey: "marcaId" })
Modelo.belongsTo(Marca, { foreignKey: "marcaId" })

Modelo.hasMany(Vehiculo, { foreignKey: "modeloId" })
Vehiculo.belongsTo(Modelo, { foreignKey: "modeloId" })

// Sincronizar modelos con la base de datos
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true })
    console.log("✅ Base de datos sincronizada correctamente")
    return true
  } catch (error) {
    console.error("❌ Error al sincronizar la base de datos:", error.message)
    return false
  }
}

module.exports = {
  sequelize,
  Usuario,
  Marca,
  Modelo,
  Vehiculo,
  syncDatabase,
}
