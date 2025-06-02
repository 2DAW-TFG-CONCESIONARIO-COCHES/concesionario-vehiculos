const { Sequelize } = require("sequelize")
const dotenv = require("dotenv")

dotenv.config()

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
})

const testConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log("Conexión a la base de datos establecida correctamente.")
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error)
  }
}

testConnection()

module.exports = sequelize
