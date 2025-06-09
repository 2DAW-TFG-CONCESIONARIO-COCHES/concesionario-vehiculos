const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")

// Cargar variables de entorno
dotenv.config()

// Inicializar la base de datos y modelos
const { syncDatabase } = require("./models/index")

// Inicializar Express
const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rutas básicas
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la API del Sistema de Gestión de Vehículos para Concesionarios" })
})

// Importar rutas
const authRoutes = require("./routes/auth.routes")
const marcaRoutes = require("./routes/marca.routes")
const modeloRoutes = require("./routes/modelo.routes")
const vehiculoRoutes = require("./routes/vehiculo.routes")
const empleadoRoutes = require("./routes/empleado.routes")

// Usar rutas
app.use("/api/auth", authRoutes)
app.use("/api/marcas", marcaRoutes)
app.use("/api/modelos", modeloRoutes)
app.use("/api/vehiculos", vehiculoRoutes)
app.use("/api/empleados", empleadoRoutes)

// Configuración del puerto
const PORT = process.env.PORT || 5000

// Sincronizar base de datos y iniciar servidor
const startServer = async () => {
  try {
    await syncDatabase()
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`)
    })
  } catch (error) {
    console.error("Error al iniciar el servidor:", error)
  }
}

startServer()
