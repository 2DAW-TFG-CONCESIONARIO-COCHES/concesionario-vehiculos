// Script para crear un usuario administrador
const bcrypt = require("bcryptjs")
const sequelize = require("../config/db.config")
const Usuario = require("../models/usuario.model")

async function createAdmin() {
  try {
    // Asegurarse de que la conexión a la base de datos está establecida
    await sequelize.authenticate()
    console.log("✅ Conexión a la base de datos establecida correctamente.")

    // Datos del administrador
    const adminData = {
      nombre: "Admin",
      apellidos: "Sistema",
      email: "admin@concesionario.com",
      password: "admin123", // ✅ Contraseña SIN hashear
      rol: "admin",
    }

    console.log("🔍 Buscando usuario administrador existente...")

    // Buscar y ELIMINAR usuario existente si existe
    const existingUser = await Usuario.findOne({ where: { email: adminData.email } })

    if (existingUser) {
      console.log("🗑️  Eliminando usuario administrador existente...")
      await existingUser.destroy()
      console.log("✅ Usuario anterior eliminado correctamente.")
    }

    console.log("👤 Creando nuevo usuario administrador...")

    // ✅ OPCIÓN 1: Dejar que el hook hashee la contraseña
    const newAdmin = await Usuario.create({
      nombre: adminData.nombre,
      apellidos: adminData.apellidos,
      email: adminData.email,
      password: adminData.password, // ✅ Contraseña SIN hashear - el hook la hasheará
      rol: adminData.rol,
    })

    console.log("✅ Usuario administrador creado correctamente.")
    console.log("🆔 ID del usuario:", newAdmin.id)

    // Verificar que la contraseña funciona
    console.log("🔐 Verificando contraseña...")
    const passwordMatch = await newAdmin.comparePassword(adminData.password)

    if (passwordMatch) {
      console.log("✅ Verificación de contraseña: CORRECTA")
    } else {
      console.log("❌ Verificación de contraseña: FALLÓ")

      // Intentar verificación manual
      const manualCheck = await bcrypt.compare(adminData.password, newAdmin.password)
      console.log("🔍 Verificación manual:", manualCheck ? "CORRECTA" : "FALLÓ")
    }

    console.log("\n" + "=".repeat(50))
    console.log("🔑 CREDENCIALES DE ACCESO:")
    console.log("📧 Email: " + adminData.email)
    console.log("🔒 Contraseña: " + adminData.password)
    console.log("🌐 URL: http://localhost:3000")
    console.log("=".repeat(50))
  } catch (error) {
    console.error("❌ Error:", error.message)
    console.error("💡 Detalles:", error)
  } finally {
    // Cerrar la conexión
    if (sequelize) {
      await sequelize.close()
      console.log("🔌 Conexión cerrada.")
    }
  }
}

// Ejecutar la función
createAdmin()
