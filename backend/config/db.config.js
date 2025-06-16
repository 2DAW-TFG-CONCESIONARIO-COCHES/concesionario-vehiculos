const { Sequelize } = require("sequelize")
const dotenv = require("dotenv")

// Cargar variables de entorno
dotenv.config()

// Configuración de la base de datos
const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER || "concesionario_user",
  password: process.env.DB_PASSWORD || "concesionario_pass",
  database: process.env.DB_NAME || "concesionario_db",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
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
  // Configuraciones adicionales para MySQL 8.0
  dialectOptions: {
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  },
})

// Probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log("✅ Conexión a la base de datos establecida correctamente")
    console.log(
      `📍 Conectado a: ${process.env.DB_USER}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    )
    return true
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:")
    console.error("   Mensaje:", error.message)
    console.error("   Host:", process.env.DB_HOST || "localhost")
    console.error("   Usuario:", process.env.DB_USER || "concesionario_user")
    console.error("   Base de datos:", process.env.DB_NAME || "concesionario_db")
    console.error("   Puerto:", process.env.DB_PORT || 3306)

    // Sugerencias específicas según el tipo de error
    if (error.message.includes("Access denied")) {
      console.error("\n💡 Posibles soluciones:")
      console.error("   1. Verifica las credenciales en el archivo .env")
      console.error("   2. Asegúrate de que Docker esté ejecutándose: docker-compose up -d db")
      console.error("   3. Verifica que las credenciales coincidan con docker-compose.yml")
    } else if (error.message.includes("ECONNREFUSED")) {
      console.error("\n💡 Posibles soluciones:")
      console.error("   1. Inicia la base de datos: docker-compose up -d db")
      console.error("   2. Verifica que el puerto 3306 esté disponible")
      console.error("   3. Espera a que MySQL esté completamente iniciado")
    }

    return false
  }
}

// Ejecutar test de conexión al cargar el módulo
testConnection()

module.exports = sequelize
