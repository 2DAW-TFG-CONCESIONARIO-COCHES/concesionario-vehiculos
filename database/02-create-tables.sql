-- ==============================================
-- CREACIÓN DE TABLAS
-- ==============================================

USE concesionario_db;

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
