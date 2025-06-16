const { sequelize, Marca, Modelo, Vehiculo, Usuario } = require("../models/index")
const bcrypt = require("bcryptjs")

// Datos de marcas reales
const marcasData = [
  {
    nombre: "Toyota",
    pais: "Japón",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Toyota-Logo.png",
  },
  {
    nombre: "BMW",
    pais: "Alemania",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/BMW-Logo.png",
  },
  {
    nombre: "Mercedes-Benz",
    pais: "Alemania",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Mercedes-Logo.png",
  },
  {
    nombre: "Audi",
    pais: "Alemania",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Audi-Logo.png",
  },
  {
    nombre: "Ford",
    pais: "Estados Unidos",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Ford-Logo.png",
  },
  {
    nombre: "Volkswagen",
    pais: "Alemania",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Volkswagen-Logo.png",
  },
  {
    nombre: "Honda",
    pais: "Japón",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Honda-Logo.png",
  },
  {
    nombre: "Nissan",
    pais: "Japón",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Nissan-Logo.png",
  },
  {
    nombre: "Hyundai",
    pais: "Corea del Sur",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Hyundai-Logo.png",
  },
  {
    nombre: "Kia",
    pais: "Corea del Sur",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Kia-Logo.png",
  },
  {
    nombre: "Mazda",
    pais: "Japón",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Mazda-Logo.png",
  },
  {
    nombre: "Subaru",
    pais: "Japón",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Subaru-Logo.png",
  },
  {
    nombre: "Volvo",
    pais: "Suecia",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Volvo-Logo.png",
  },
  {
    nombre: "Peugeot",
    pais: "Francia",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Peugeot-Logo.png",
  },
  {
    nombre: "Renault",
    pais: "Francia",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Renault-Logo.png",
  },
]

// Datos de modelos por marca
const modelosData = {
  Toyota: [
    { nombre: "Corolla", anio: 2023, tipo: "sedan" },
    { nombre: "Camry", anio: 2023, tipo: "sedan" },
    { nombre: "RAV4", anio: 2023, tipo: "suv" },
    { nombre: "Highlander", anio: 2023, tipo: "suv" },
    { nombre: "Prius", anio: 2023, tipo: "hatchback" },
    { nombre: "Yaris", anio: 2022, tipo: "hatchback" },
    { nombre: "Land Cruiser", anio: 2023, tipo: "suv" },
    { nombre: "Hilux", anio: 2023, tipo: "pickup" },
  ],
  BMW: [
    { nombre: "Serie 3", anio: 2023, tipo: "sedan" },
    { nombre: "Serie 5", anio: 2023, tipo: "sedan" },
    { nombre: "X3", anio: 2023, tipo: "suv" },
    { nombre: "X5", anio: 2023, tipo: "suv" },
    { nombre: "X1", anio: 2022, tipo: "suv" },
    { nombre: "M3", anio: 2023, tipo: "deportivo" },
    { nombre: "M5", anio: 2023, tipo: "deportivo" },
    { nombre: "i4", anio: 2023, tipo: "sedan" },
  ],
  "Mercedes-Benz": [
    { nombre: "Clase C", anio: 2023, tipo: "sedan" },
    { nombre: "Clase E", anio: 2023, tipo: "sedan" },
    { nombre: "Clase S", anio: 2023, tipo: "sedan" },
    { nombre: "GLC", anio: 2023, tipo: "suv" },
    { nombre: "GLE", anio: 2023, tipo: "suv" },
    { nombre: "A-Class", anio: 2022, tipo: "hatchback" },
    { nombre: "AMG GT", anio: 2023, tipo: "deportivo" },
    { nombre: "EQC", anio: 2023, tipo: "suv" },
  ],
  Audi: [
    { nombre: "A3", anio: 2023, tipo: "sedan" },
    { nombre: "A4", anio: 2023, tipo: "sedan" },
    { nombre: "A6", anio: 2023, tipo: "sedan" },
    { nombre: "Q3", anio: 2023, tipo: "suv" },
    { nombre: "Q5", anio: 2023, tipo: "suv" },
    { nombre: "Q7", anio: 2023, tipo: "suv" },
    { nombre: "RS6", anio: 2023, tipo: "deportivo" },
    { nombre: "e-tron", anio: 2023, tipo: "suv" },
  ],
  Ford: [
    { nombre: "Focus", anio: 2022, tipo: "hatchback" },
    { nombre: "Fiesta", anio: 2022, tipo: "hatchback" },
    { nombre: "Mondeo", anio: 2022, tipo: "sedan" },
    { nombre: "Kuga", anio: 2023, tipo: "suv" },
    { nombre: "Explorer", anio: 2023, tipo: "suv" },
    { nombre: "Mustang", anio: 2023, tipo: "deportivo" },
    { nombre: "F-150", anio: 2023, tipo: "pickup" },
    { nombre: "Ranger", anio: 2023, tipo: "pickup" },
  ],
  Volkswagen: [
    { nombre: "Golf", anio: 2023, tipo: "hatchback" },
    { nombre: "Polo", anio: 2022, tipo: "hatchback" },
    { nombre: "Passat", anio: 2023, tipo: "sedan" },
    { nombre: "Tiguan", anio: 2023, tipo: "suv" },
    { nombre: "Touareg", anio: 2023, tipo: "suv" },
    { nombre: "Arteon", anio: 2023, tipo: "sedan" },
    { nombre: "ID.4", anio: 2023, tipo: "suv" },
    { nombre: "Amarok", anio: 2023, tipo: "pickup" },
  ],
  Honda: [
    { nombre: "Civic", anio: 2023, tipo: "sedan" },
    { nombre: "Accord", anio: 2023, tipo: "sedan" },
    { nombre: "CR-V", anio: 2023, tipo: "suv" },
    { nombre: "HR-V", anio: 2023, tipo: "suv" },
    { nombre: "Pilot", anio: 2023, tipo: "suv" },
    { nombre: "Fit", anio: 2022, tipo: "hatchback" },
    { nombre: "Ridgeline", anio: 2023, tipo: "pickup" },
    { nombre: "Type R", anio: 2023, tipo: "deportivo" },
  ],
  Nissan: [
    { nombre: "Sentra", anio: 2023, tipo: "sedan" },
    { nombre: "Altima", anio: 2023, tipo: "sedan" },
    { nombre: "Rogue", anio: 2023, tipo: "suv" },
    { nombre: "Murano", anio: 2023, tipo: "suv" },
    { nombre: "Pathfinder", anio: 2023, tipo: "suv" },
    { nombre: "Versa", anio: 2022, tipo: "sedan" },
    { nombre: "370Z", anio: 2023, tipo: "deportivo" },
    { nombre: "Frontier", anio: 2023, tipo: "pickup" },
  ],
  Hyundai: [
    { nombre: "Elantra", anio: 2023, tipo: "sedan" },
    { nombre: "Sonata", anio: 2023, tipo: "sedan" },
    { nombre: "Tucson", anio: 2023, tipo: "suv" },
    { nombre: "Santa Fe", anio: 2023, tipo: "suv" },
    { nombre: "Palisade", anio: 2023, tipo: "suv" },
    { nombre: "i30", anio: 2022, tipo: "hatchback" },
    { nombre: "Kona", anio: 2023, tipo: "suv" },
    { nombre: "Ioniq 5", anio: 2023, tipo: "suv" },
  ],
  Kia: [
    { nombre: "Forte", anio: 2023, tipo: "sedan" },
    { nombre: "Optima", anio: 2022, tipo: "sedan" },
    { nombre: "Sportage", anio: 2023, tipo: "suv" },
    { nombre: "Sorento", anio: 2023, tipo: "suv" },
    { nombre: "Telluride", anio: 2023, tipo: "suv" },
    { nombre: "Rio", anio: 2022, tipo: "hatchback" },
    { nombre: "Stinger", anio: 2023, tipo: "deportivo" },
    { nombre: "EV6", anio: 2023, tipo: "suv" },
  ],
  Mazda: [
    { nombre: "Mazda3", anio: 2023, tipo: "sedan" },
    { nombre: "Mazda6", anio: 2022, tipo: "sedan" },
    { nombre: "CX-3", anio: 2022, tipo: "suv" },
    { nombre: "CX-5", anio: 2023, tipo: "suv" },
    { nombre: "CX-9", anio: 2023, tipo: "suv" },
    { nombre: "MX-5", anio: 2023, tipo: "deportivo" },
    { nombre: "CX-30", anio: 2023, tipo: "suv" },
    { nombre: "MX-30", anio: 2023, tipo: "suv" },
  ],
  Subaru: [
    { nombre: "Impreza", anio: 2023, tipo: "sedan" },
    { nombre: "Legacy", anio: 2023, tipo: "sedan" },
    { nombre: "Outback", anio: 2023, tipo: "suv" },
    { nombre: "Forester", anio: 2023, tipo: "suv" },
    { nombre: "Ascent", anio: 2023, tipo: "suv" },
    { nombre: "WRX", anio: 2023, tipo: "deportivo" },
    { nombre: "Crosstrek", anio: 2023, tipo: "suv" },
    { nombre: "BRZ", anio: 2023, tipo: "deportivo" },
  ],
  Volvo: [
    { nombre: "S60", anio: 2023, tipo: "sedan" },
    { nombre: "S90", anio: 2023, tipo: "sedan" },
    { nombre: "XC40", anio: 2023, tipo: "suv" },
    { nombre: "XC60", anio: 2023, tipo: "suv" },
    { nombre: "XC90", anio: 2023, tipo: "suv" },
    { nombre: "V60", anio: 2023, tipo: "otro" },
    { nombre: "C40", anio: 2023, tipo: "suv" },
    { nombre: "EX30", anio: 2024, tipo: "suv" },
  ],
  Peugeot: [
    { nombre: "208", anio: 2023, tipo: "hatchback" },
    { nombre: "308", anio: 2023, tipo: "hatchback" },
    { nombre: "508", anio: 2023, tipo: "sedan" },
    { nombre: "2008", anio: 2023, tipo: "suv" },
    { nombre: "3008", anio: 2023, tipo: "suv" },
    { nombre: "5008", anio: 2023, tipo: "suv" },
    { nombre: "e-208", anio: 2023, tipo: "hatchback" },
    { nombre: "Partner", anio: 2023, tipo: "otro" },
  ],
  Renault: [
    { nombre: "Clio", anio: 2023, tipo: "hatchback" },
    { nombre: "Megane", anio: 2023, tipo: "hatchback" },
    { nombre: "Talisman", anio: 2022, tipo: "sedan" },
    { nombre: "Captur", anio: 2023, tipo: "suv" },
    { nombre: "Kadjar", anio: 2023, tipo: "suv" },
    { nombre: "Koleos", anio: 2023, tipo: "suv" },
    { nombre: "Zoe", anio: 2023, tipo: "hatchback" },
    { nombre: "Arkana", anio: 2023, tipo: "suv" },
  ],
}

// Colores disponibles
const colores = [
  "Blanco",
  "Negro",
  "Gris",
  "Plata",
  "Azul",
  "Rojo",
  "Verde",
  "Amarillo",
  "Naranja",
  "Marrón",
  "Beige",
  "Violeta",
  "Rosa",
]

// Estados disponibles
const estados = ["nuevo", "usado", "vendido"]

// Combustibles disponibles
const combustibles = ["gasolina", "diesel", "electrico", "hibrido"]

// Transmisiones disponibles
const transmisiones = ["manual", "automatica"]

// Función para generar un número aleatorio entre min y max
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

// Función para obtener un elemento aleatorio de un array
const randomFromArray = (array) => array[Math.floor(Math.random() * array.length)]

// Función para generar un VIN aleatorio
const generateVIN = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let vin = ""
  for (let i = 0; i < 17; i++) {
    vin += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return vin
}

// Función para generar precio basado en marca, año y tipo
const generatePrice = (marca, anio, tipo) => {
  let basePrice = 15000 // Precio base

  // Ajustar por marca (marcas premium más caras)
  const premiumBrands = ["BMW", "Mercedes-Benz", "Audi", "Volvo"]
  const luxuryBrands = ["Mercedes-Benz", "BMW"]

  if (luxuryBrands.includes(marca)) {
    basePrice += randomBetween(25000, 45000)
  } else if (premiumBrands.includes(marca)) {
    basePrice += randomBetween(15000, 30000)
  } else {
    basePrice += randomBetween(5000, 20000)
  }

  // Ajustar por año
  const currentYear = new Date().getFullYear()
  const yearDiff = currentYear - anio
  basePrice -= yearDiff * randomBetween(2000, 4000)

  // Ajustar por tipo
  const typeMultipliers = {
    sedan: 1.0,
    suv: 1.3,
    hatchback: 0.8,
    pickup: 1.2,
    deportivo: 1.8,
    otro: 1.0,
  }

  basePrice *= typeMultipliers[tipo] || 1.0

  // Añadir variación aleatoria
  basePrice += randomBetween(-5000, 10000)

  // Asegurar precio mínimo
  return Math.max(8000, Math.round(basePrice))
}

const generateKilometraje = (anio, estado) => {
  const currentYear = new Date().getFullYear()
  const yearDiff = currentYear - anio

  if (estado === "nuevo") {
    return randomBetween(0, 100)
  } else {
    const baseKm = yearDiff * randomBetween(15000, 25000)
    return baseKm + randomBetween(-5000, 10000)
  }
}

const seedDatabase = async () => {
  try {
    console.log("🌱 Iniciando población de la base de datos...")

    await sequelize.sync({ force: false })
    console.log("✅ Base de datos sincronizada")

    // 1. Crear usuario administrador si no existe
    console.log("👤 Creando usuario administrador...")
    const [admin, adminCreated] = await Usuario.findOrCreate({
      where: { email: "admin@concesionario.com" },
      defaults: {
        nombre: "Administrador",
        apellidos: "Sistema",
        email: "admin@concesionario.com",
        password: await bcrypt.hash("admin123", 10),
        rol: "admin",
      },
    })

    if (adminCreated) {
      console.log("✅ Usuario administrador creado")
      console.log("   Email: admin@concesionario.com")
      console.log("   Contraseña: admin123")
    } else {
      console.log("ℹ️  Usuario administrador ya existe")
    }

    // 2. Crear empleado de ejemplo si no existe
    const [empleado, empleadoCreated] = await Usuario.findOrCreate({
      where: { email: "empleado@concesionario.com" },
      defaults: {
        nombre: "Juan",
        apellidos: "Pérez García",
        email: "empleado@concesionario.com",
        password: await bcrypt.hash("empleado123", 10),
        rol: "empleado",
      },
    })

    if (empleadoCreated) {
      console.log("✅ Usuario empleado creado")
      console.log("   Email: empleado@concesionario.com")
      console.log("   Contraseña: empleado123")
    } else {
      console.log("ℹ️  Usuario empleado ya existe")
    }

    // 3. Crear marcas
    console.log("🏭 Creando marcas...")
    const marcasCreadas = []

    for (const marcaData of marcasData) {
      const [marca, created] = await Marca.findOrCreate({
        where: { nombre: marcaData.nombre },
        defaults: marcaData,
      })
      marcasCreadas.push(marca)
      if (created) {
        console.log(`   ✅ Marca creada: ${marca.nombre}`)
      }
    }

    console.log(`✅ ${marcasCreadas.length} marcas procesadas`)

    // 4. Crear modelos
    console.log("🚗 Creando modelos...")
    const modelosCreados = []

    for (const marca of marcasCreadas) {
      const modelosParaMarca = modelosData[marca.nombre] || []

      for (const modeloData of modelosParaMarca) {
        const [modelo, created] = await Modelo.findOrCreate({
          where: {
            nombre: modeloData.nombre,
            marcaId: marca.id,
          },
          defaults: {
            ...modeloData,
            marcaId: marca.id,
          },
        })
        modelosCreados.push(modelo)
        if (created) {
          console.log(`   ✅ Modelo creado: ${marca.nombre} ${modelo.nombre}`)
        }
      }
    }

    console.log(`✅ ${modelosCreados.length} modelos procesados`)

    // 5. Crear vehículos
    console.log("🚙 Creando vehículos...")
    let vehiculosCreados = 0

    for (const modelo of modelosCreados) {
      // Esto es paraa crear entre 2 y 8 vehículos por modelo
      const numVehiculos = randomBetween(2, 8)

      for (let i = 0; i < numVehiculos; i++) {
        const marca = await Marca.findByPk(modelo.marcaId)
        const estado = randomFromArray(estados)
        const color = randomFromArray(colores)
        const combustible = randomFromArray(combustibles)
        const transmision = randomFromArray(transmisiones)
        const precio = generatePrice(marca.nombre, modelo.anio, modelo.tipo)
        const kilometraje = generateKilometraje(modelo.anio, estado)

        const descripciones = [
          `Excelente ${modelo.nombre} en perfecto estado. Mantenimiento al día.`,
          `${marca.nombre} ${modelo.nombre} con todas las revisiones realizadas.`,
          `Vehículo muy cuidado, ideal para uso familiar.`,
          `${modelo.nombre} con equipamiento completo y garantía.`,
          `Oportunidad única, ${modelo.nombre} en excelentes condiciones.`,
          `${marca.nombre} ${modelo.nombre} con historial de mantenimiento completo.`,
          `Vehículo de un solo propietario, muy bien conservado.`,
          `${modelo.nombre} con extras incluidos, no te lo pierdas.`,
        ]

        try {
          const vehiculo = await Vehiculo.create({
            vin: generateVIN(),
            color: color,
            precio: precio,
            kilometraje: Math.max(0, kilometraje),
            combustible: combustible,
            transmision: transmision,
            estado: estado,
            descripcion: randomFromArray(descripciones),
            imagenes: [],
            modeloId: modelo.id,
          })

          vehiculosCreados++

          if (vehiculosCreados % 50 === 0) {
            console.log(`   📊 ${vehiculosCreados} vehículos creados...`)
          }
        } catch (error) {
          console.error(`   ❌ Error creando vehículo para ${marca.nombre} ${modelo.nombre}:`, error.message)
        }
      }
    }

    console.log(`✅ ${vehiculosCreados} vehículos creados`)

    // 6. Resumen final
    console.log("\n📊 ESTADÍSTICAS FINALES:")
    console.log("========================")

    const totalMarcas = await Marca.count()
    const totalModelos = await Modelo.count()
    const totalVehiculos = await Vehiculo.count()
    const totalUsuarios = await Usuario.count()

    console.log(`👥 Usuarios: ${totalUsuarios}`)
    console.log(`🏭 Marcas: ${totalMarcas}`)
    console.log(`🚗 Modelos: ${totalModelos}`)
    console.log(`🚙 Vehículos: ${totalVehiculos}`)

    // Estadísticas por estado
    const vehiculosNuevos = await Vehiculo.count({ where: { estado: "nuevo" } })
    const vehiculosUsados = await Vehiculo.count({ where: { estado: "usado" } })
    const vehiculosVendidos = await Vehiculo.count({ where: { estado: "vendido" } })

    console.log(`\n🚙 Por estado:`)
    console.log(`   Nuevos: ${vehiculosNuevos}`)
    console.log(`   Usados: ${vehiculosUsados}`)
    console.log(`   Vendidos: ${vehiculosVendidos}`)

    console.log("\n🎉 ¡Base de datos poblada exitosamente!")
    console.log("\n🔑 CREDENCIALES DE ACCESO:")
    console.log("==========================")
    console.log("👨‍💼 Administrador:")
    console.log("   Email: admin@concesionario.com")
    console.log("   Contraseña: admin123")
    console.log("\n👨‍💻 Empleado:")
    console.log("   Email: empleado@concesionario.com")
    console.log("   Contraseña: empleado123")
  } catch (error) {
    console.error("❌ Error poblando la base de datos:", error)
  } finally {
    await sequelize.close()
    console.log("🔌 Conexión a la base de datos cerrada")
  }
}

// Ejecutar el script
seedDatabase()
