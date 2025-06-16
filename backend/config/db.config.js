const { Sequelize } = require("sequelize")

// Configuración de la base de datos
const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "concesionario_db",
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: false,
  },
})

// Probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log("✅ Conexión a la base de datos establecida correctamente")
    return true
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error.message)
    return false
  }
}

module.exports = sequelize
