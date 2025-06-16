const { sequelize, Marca, Modelo, Vehiculo, Usuario } = require("../models/index")

const clearDatabase = async () => {
  try {
    console.log("🗑️  Iniciando limpieza de la base de datos...")

    // Sincronizar base de datos
    await sequelize.sync({ force: false })
    console.log("✅ Conexión establecida")

    // Eliminar en orden correcto (respetando las foreign keys)
    console.log("🚙 Eliminando vehículos...")
    const vehiculosEliminados = await Vehiculo.destroy({ where: {} })
    console.log(`   ✅ ${vehiculosEliminados} vehículos eliminados`)

    console.log("🚗 Eliminando modelos...")
    const modelosEliminados = await Modelo.destroy({ where: {} })
    console.log(`   ✅ ${modelosEliminados} modelos eliminados`)

    console.log("🏭 Eliminando marcas...")
    const marcasEliminadas = await Marca.destroy({ where: {} })
    console.log(`   ✅ ${marcasEliminadas} marcas eliminadas`)

    console.log("👥 Eliminando usuarios...")
    const usuariosEliminados = await Usuario.destroy({ where: {} })
    console.log(`   ✅ ${usuariosEliminados} usuarios eliminados`)

    console.log("\n🎉 ¡Base de datos limpiada exitosamente!")
  } catch (error) {
    console.error("❌ Error limpiando la base de datos:", error)
  } finally {
    await sequelize.close()
    console.log("🔌 Conexión a la base de datos cerrada")
  }
}

// Ejecutar el script
clearDatabase()
