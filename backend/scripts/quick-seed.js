const { sequelize, Marca, Modelo, Vehiculo, Usuario } = require("../models/index")
const bcrypt = require("bcryptjs")

// Datos básicos para población rápida
const quickData = {
  marcas: [
    { nombre: "Toyota", pais: "Japón" },
    { nombre: "BMW", pais: "Alemania" },
    { nombre: "Ford", pais: "Estados Unidos" },
    { nombre: "Volkswagen", pais: "Alemania" },
    { nombre: "Honda", pais: "Japón" },
  ],
  modelos: [
    { nombre: "Corolla", anio: 2023, tipo: "sedan", marca: "Toyota" },
    { nombre: "RAV4", anio: 2023, tipo: "suv", marca: "Toyota" },
    { nombre: "Serie 3", anio: 2023, tipo: "sedan", marca: "BMW" },
    { nombre: "X3", anio: 2023, tipo: "suv", marca: "BMW" },
    { nombre: "Focus", anio: 2022, tipo: "hatchback", marca: "Ford" },
    { nombre: "Kuga", anio: 2023, tipo: "suv", marca: "Ford" },
    { nombre: "Golf", anio: 2023, tipo: "hatchback", marca: "Volkswagen" },
    { nombre: "Tiguan", anio: 2023, tipo: "suv", marca: "Volkswagen" },
    { nombre: "Civic", anio: 2023, tipo: "sedan", marca: "Honda" },
    { nombre: "CR-V", anio: 2023, tipo: "suv", marca: "Honda" },
  ],
}

const colores = ["Blanco", "Negro", "Gris", "Azul", "Rojo"]
const estados = ["nuevo", "usado"]
const combustibles = ["gasolina", "diesel", "hibrido"]
const transmisiones = ["manual", "automatica"]

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const randomFromArray = (array) => array[Math.floor(Math.random() * array.length)]

const generateVIN = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let vin = ""
  for (let i = 0; i < 17; i++) {
    vin += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return vin
}

const quickSeed = async () => {
  try {
    console.log("⚡ Iniciando población rápida de la base de datos...")

    await sequelize.sync({ force: false })
    console.log("✅ Base de datos sincronizada")

    // Crear admin
    const [admin] = await Usuario.findOrCreate({
      where: { email: "admin@test.com" },
      defaults: {
        nombre: "Admin",
        apellidos: "Test",
        email: "admin@test.com",
        password: await bcrypt.hash("123456", 10),
        rol: "admin",
      },
    })
    console.log("✅ Usuario admin creado (admin@test.com / 123456)")

    // Crear empleado
    const [empleado] = await Usuario.findOrCreate({
      where: { email: "empleado@test.com" },
      defaults: {
        nombre: "Empleado",
        apellidos: "Test",
        email: "empleado@test.com",
        password: await bcrypt.hash("123456", 10),
        rol: "empleado",
      },
    })
    console.log("✅ Usuario empleado creado (empleado@test.com / 123456)")

    // Crear marcas
    const marcasCreadas = []
    for (const marcaData of quickData.marcas) {
      const [marca] = await Marca.findOrCreate({
        where: { nombre: marcaData.nombre },
        defaults: marcaData,
      })
      marcasCreadas.push(marca)
    }
    console.log(`✅ ${marcasCreadas.length} marcas creadas`)

    // Crear modelos
    const modelosCreados = []
    for (const modeloData of quickData.modelos) {
      const marca = marcasCreadas.find((m) => m.nombre === modeloData.marca)
      if (marca) {
        const [modelo] = await Modelo.findOrCreate({
          where: { nombre: modeloData.nombre, marcaId: marca.id },
          defaults: {
            nombre: modeloData.nombre,
            anio: modeloData.anio,
            tipo: modeloData.tipo,
            marcaId: marca.id,
          },
        })
        modelosCreados.push(modelo)
      }
    }
    console.log(`✅ ${modelosCreados.length} modelos creados`)

    // Crear vehículos (3-5 por modelo)
    let vehiculosCreados = 0
    for (const modelo of modelosCreados) {
      const numVehiculos = randomBetween(3, 5)

      for (let i = 0; i < numVehiculos; i++) {
        const estado = randomFromArray(estados)
        await Vehiculo.create({
          vin: generateVIN(),
          color: randomFromArray(colores),
          precio: randomBetween(15000, 45000),
          kilometraje: estado === "nuevo" ? randomBetween(0, 100) : randomBetween(10000, 80000),
          combustible: randomFromArray(combustibles),
          transmision: randomFromArray(transmisiones),
          estado: estado,
          descripcion: `${modelo.nombre} en excelente estado`,
          imagenes: [],
          modeloId: modelo.id,
        })
        vehiculosCreados++
      }
    }
    console.log(`✅ ${vehiculosCreados} vehículos creados`)

    console.log("\n🎉 ¡Población rápida completada!")
    console.log("🔑 Credenciales:")
    console.log("   Admin: admin@test.com / 123456")
    console.log("   Empleado: empleado@test.com / 123456")
  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await sequelize.close()
  }
}

quickSeed()
