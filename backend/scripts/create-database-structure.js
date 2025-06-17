const mysql = require("mysql2/promise")
const sequelize = require("../config/db.config")
const { Usuario, Marca, Modelo, Vehiculo } = require("../models")

async function createDatabaseStructure() {
  let connection = null

  try {
    console.log("🚀 Creando estructura de base de datos...")

    // 1. Crear la base de datos si no existe
    console.log("📋 Creando base de datos si no existe...")
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      port: process.env.DB_PORT || 3306,
    })

    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    )
    console.log(`✅ Base de datos '${process.env.DB_NAME}' creada/verificada`)

    await connection.end()

    // 2. Conectar a la base de datos específica
    console.log("🔌 Conectando a la base de datos...")
    await sequelize.authenticate()
    console.log("✅ Conexión establecida correctamente")

    // 3. Eliminar tablas existentes (solo si se especifica)
    if (process.argv.includes("--force")) {
      console.log("🗑️  Eliminando tablas existentes...")
      await sequelize.drop()
      console.log("✅ Tablas eliminadas")
    }

    // 4. Crear todas las tablas con sus relaciones
    console.log("🏗️  Creando estructura de tablas...")
    await sequelize.sync({
      force: process.argv.includes("--force"),
      alter: !process.argv.includes("--force"),
    })
    console.log("✅ Tablas creadas correctamente")

    // 5. Verificar que las tablas se crearon
    const tables = await sequelize.getQueryInterface().showAllTables()
    console.log("📋 Tablas creadas:", tables)

    // 6. Verificar estructura específica del campo logo
    console.log("🔍 Verificando estructura de la tabla Marcas...")
    const marcasDescription = await sequelize.getQueryInterface().describeTable("Marcas")
    console.log("📝 Campo logo:", marcasDescription.logo)

    if (marcasDescription.logo.type !== "LONGTEXT") {
      console.log("🔧 Actualizando campo logo a LONGTEXT...")
      await sequelize.getQueryInterface().changeColumn("Marcas", "logo", {
        type: sequelize.Sequelize.TEXT("long"),
        allowNull: true,
      })
      console.log("✅ Campo logo actualizado")
    }

    console.log("\n🎉 ¡Estructura de base de datos creada correctamente!")
    console.log("\n📋 Resumen:")
    console.log(`   • Base de datos: ${process.env.DB_NAME}`)
    console.log(`   • Tablas creadas: ${tables.length}`)
    console.log("   • Relaciones establecidas")
    console.log("   • Campo logo configurado como LONGTEXT")
    console.log("\n💡 Ahora puedes ejecutar los scripts de datos:")
    console.log("   npm run create-admin")
    console.log("   npm run seed-data")
  } catch (error) {
    console.error("❌ Error al crear estructura:", error)
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
    }
    await sequelize.close()
  }
}

module.exports = createDatabaseStructure
