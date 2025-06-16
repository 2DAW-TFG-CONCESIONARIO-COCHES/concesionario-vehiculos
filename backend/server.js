const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")

// Cargar variables de entorno
dotenv.config()

// Inicializar Express
const app = express()

// Middleware CORS - permitir peticiones desde el frontend
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
  }),
)

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Rutas básicas
app.get("/", (req, res) => {
  res.json({
    message: "Bienvenido a la API del Sistema de Gestión de Vehículos para Concesionario Batoi",
    status: "OK",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth",
      marcas: "/api/marcas",
      modelos: "/api/modelos",
      vehiculos: "/api/vehiculos",
      usuarios: "/api/usuarios",
    },
  })
})

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Importar rutas
const authRoutes = require("./routes/auth.routes")
const marcaRoutes = require("./routes/marca.routes")
const modeloRoutes = require("./routes/modelo.routes")
const vehiculoRoutes = require("./routes/vehiculo.routes")
const usuarioRoutes = require("./routes/usuario.routes")

// Usar rutas
app.use("/api/auth", authRoutes)
app.use("/api/marcas", marcaRoutes)
app.use("/api/modelos", modeloRoutes)
app.use("/api/vehiculos", vehiculoRoutes)
app.use("/api/usuarios", usuarioRoutes)

// Middleware para rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Ruta no encontrada",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  })
})

// Middleware para manejo de errores
app.use((error, req, res, next) => {
  console.error("Error:", error)
  res.status(500).json({
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? error.message : "Error interno",
  })
})

// Configuración del puerto
const PORT = process.env.PORT || 5000

// Inicializar la base de datos y el servidor
const { syncDatabase } = require("./models/index")

const startServer = async () => {
  try {
    // Sincronizar la base de datos
    await syncDatabase()
    console.log("✅ Base de datos sincronizada correctamente")

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`)
      console.log(`📍 URL: http://localhost:${PORT}`)
      console.log(`🔗 API Base: http://localhost:${PORT}/api`)
      console.log(`💾 Base de datos: ${process.env.DB_NAME}`)
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || "development"}`)
    })
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error)
    process.exit(1)
  }
}

startServer()
