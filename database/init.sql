-- ==============================================
-- SCRIPT DE INICIALIZACIÓN AUTOMÁTICA
-- Este archivo se ejecuta automáticamente al crear el contenedor
-- ==============================================

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS concesionario_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE concesionario_db;

-- Configurar el motor de almacenamiento por defecto
SET default_storage_engine = InnoDB;

-- Configurar el modo SQL
SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO';

-- ==============================================
-- CREACIÓN DE TABLAS
-- ==============================================

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'empleado') DEFAULT 'empleado',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_email (email),
    INDEX idx_rol (rol),
    INDEX idx_created (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Marcas
CREATE TABLE IF NOT EXISTS Marcas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    pais VARCHAR(100),
    logo TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_nombre (nombre),
    INDEX idx_pais (pais)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Modelos
CREATE TABLE IF NOT EXISTS Modelos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    anio INT NOT NULL,
    tipo ENUM('sedan', 'suv', 'hatchback', 'pickup', 'deportivo', 'otro') DEFAULT 'otro',
    marcaId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Claves foráneas
    FOREIGN KEY (marcaId) REFERENCES Marcas(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Índices
    INDEX idx_nombre (nombre),
    INDEX idx_anio (anio),
    INDEX idx_tipo (tipo),
    INDEX idx_marca (marcaId),
    INDEX idx_marca_modelo (marcaId, nombre),
    
    -- Restricciones
    CONSTRAINT chk_anio CHECK (anio >= 1900 AND anio <= 2100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Vehículos
CREATE TABLE IF NOT EXISTS Vehiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vin VARCHAR(17) NOT NULL UNIQUE,
    color VARCHAR(50) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    kilometraje INT NOT NULL DEFAULT 0,
    combustible ENUM('gasolina', 'diesel', 'electrico', 'hibrido') NOT NULL,
    transmision ENUM('manual', 'automatica') NOT NULL,
    estado ENUM('nuevo', 'usado', 'vendido') DEFAULT 'nuevo',
    descripcion TEXT,
    imagenes JSON,
    modeloId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Claves foráneas
    FOREIGN KEY (modeloId) REFERENCES Modelos(id) ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Índices
    INDEX idx_vin (vin),
    INDEX idx_precio (precio),
    INDEX idx_kilometraje (kilometraje),
    INDEX idx_combustible (combustible),
    INDEX idx_transmision (transmision),
    INDEX idx_estado (estado),
    INDEX idx_modelo (modeloId),
    INDEX idx_precio_estado (precio, estado),
    INDEX idx_combustible_transmision (combustible, transmision),
    
    -- Restricciones
    CONSTRAINT chk_precio CHECK (precio >= 0),
    CONSTRAINT chk_kilometraje CHECK (kilometraje >= 0),
    CONSTRAINT chk_vin_length CHECK (CHAR_LENGTH(vin) = 17)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================
-- DATOS DE EJEMPLO
-- ==============================================

-- Insertar marcas de ejemplo
INSERT INTO Marcas (nombre, pais, logo) VALUES
('Toyota', 'Japón', 'https://example.com/logos/toyota.png'),
('BMW', 'Alemania', 'https://example.com/logos/bmw.png'),
('Ford', 'Estados Unidos', 'https://example.com/logos/ford.png'),
('Volkswagen', 'Alemania', 'https://example.com/logos/volkswagen.png'),
('Mercedes-Benz', 'Alemania', 'https://example.com/logos/mercedes.png'),
('Audi', 'Alemania', 'https://example.com/logos/audi.png'),
('Honda', 'Japón', 'https://example.com/logos/honda.png'),
('Nissan', 'Japón', 'https://example.com/logos/nissan.png'),
('Hyundai', 'Corea del Sur', 'https://example.com/logos/hyundai.png'),
('Kia', 'Corea del Sur', 'https://example.com/logos/kia.png');

-- Insertar modelos de ejemplo
INSERT INTO Modelos (nombre, anio, tipo, marcaId) VALUES
-- Toyota
('Corolla', 2023, 'sedan', 1),
('RAV4', 2023, 'suv', 1),
('Camry', 2023, 'sedan', 1),
('Prius', 2023, 'sedan', 1),
('Highlander', 2023, 'suv', 1),

-- BMW
('Serie 3', 2023, 'sedan', 2),
('X3', 2023, 'suv', 2),
('X5', 2023, 'suv', 2),
('Serie 5', 2023, 'sedan', 2),
('Z4', 2023, 'deportivo', 2),

-- Ford
('Focus', 2023, 'hatchback', 3),
('Mustang', 2023, 'deportivo', 3),
('Explorer', 2023, 'suv', 3),
('F-150', 2023, 'pickup', 3),
('Escape', 2023, 'suv', 3),

-- Volkswagen
('Golf', 2023, 'hatchback', 4),
('Passat', 2023, 'sedan', 4),
('Tiguan', 2023, 'suv', 4),
('Polo', 2023, 'hatchback', 4),
('Arteon', 2023, 'sedan', 4),

-- Mercedes-Benz
('Clase C', 2023, 'sedan', 5),
('GLC', 2023, 'suv', 5),
('Clase E', 2023, 'sedan', 5),
('GLE', 2023, 'suv', 5),
('AMG GT', 2023, 'deportivo', 5);

-- Insertar vehículos de ejemplo
INSERT INTO Vehiculos (vin, color, precio, kilometraje, combustible, transmision, estado, descripcion, modeloId) VALUES
-- Toyota Corolla
('1HGBH41JXMN109186', 'Blanco', 25000.00, 0, 'gasolina', 'automatica', 'nuevo', 'Toyota Corolla 2023 completamente nuevo, con todas las características de seguridad estándar.', 1),
('2HGBH41JXMN109187', 'Negro', 24500.00, 15000, 'gasolina', 'manual', 'usado', 'Toyota Corolla en excelente estado, un solo propietario.', 1),

-- Toyota RAV4
('3HGBH41JXMN109188', 'Gris', 35000.00, 0, 'hibrido', 'automatica', 'nuevo', 'Toyota RAV4 Híbrido 2023, perfecto para aventuras familiares.', 2),
('4HGBH41JXMN109189', 'Azul', 32000.00, 25000, 'gasolina', 'automatica', 'usado', 'RAV4 en muy buen estado, mantenimiento al día.', 2),

-- BMW Serie 3
('5HGBH41JXMN109190', 'Plata', 45000.00, 0, 'gasolina', 'automatica', 'nuevo', 'BMW Serie 3 2023, lujo y deportividad en perfecta armonía.', 6),
('6HGBH41JXMN109191', 'Negro', 42000.00, 18000, 'diesel', 'automatica', 'usado', 'BMW Serie 3 diésel, económico y potente.', 6),

-- Ford Mustang
('7HGBH41JXMN109192', 'Rojo', 55000.00, 0, 'gasolina', 'manual', 'nuevo', 'Ford Mustang 2023, el icono americano renovado.', 12),
('8HGBH41JXMN109193', 'Amarillo', 52000.00, 8000, 'gasolina', 'automatica', 'usado', 'Mustang en perfecto estado, pocos kilómetros.', 12),

-- Volkswagen Golf
('9HGBH41JXMN109194', 'Blanco', 28000.00, 0, 'gasolina', 'manual', 'nuevo', 'Volkswagen Golf 2023, compacto y eficiente.', 16),
('AHGBH41JXMN109195', 'Gris', 26000.00, 22000, 'diesel', 'manual', 'usado', 'Golf diésel en excelente estado.', 16),

-- Mercedes Clase C
('BHGBH41JXMN109196', 'Negro', 50000.00, 0, 'gasolina', 'automatica', 'nuevo', 'Mercedes-Benz Clase C 2023, elegancia y tecnología.', 21),
('CHGBH41JXMN109197', 'Blanco', 47000.00, 12000, 'diesel', 'automatica', 'usado', 'Clase C diésel, lujo accesible.', 21);

-- Insertar usuario administrador por defecto
-- Contraseña: password123 (será hasheada por la aplicación)
INSERT INTO Usuarios (nombre, apellidos, email, password, rol) VALUES
('Administrador', 'Sistema', 'admin@concesionario.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Juan', 'Pérez García', 'empleado@concesionario.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'empleado');

-- Mostrar resumen de la configuración
SELECT 'Base de datos inicializada correctamente' as status;

-- Mostrar estadísticas iniciales
SELECT 
    (SELECT COUNT(*) FROM Usuarios) as total_usuarios,
    (SELECT COUNT(*) FROM Marcas) as total_marcas,
    (SELECT COUNT(*) FROM Modelos) as total_modelos,
    (SELECT COUNT(*) FROM Vehiculos) as total_vehiculos;
