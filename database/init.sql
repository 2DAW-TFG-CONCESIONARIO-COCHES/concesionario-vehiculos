-- Script de inicialización de la base de datos
USE concesionario_db;

-- Crear usuario administrador por defecto
-- La contraseña será hasheada por la aplicación al crear el primer usuario
-- Este script es opcional, puedes crear usuarios desde la aplicación

-- Insertar algunas marcas de ejemplo
INSERT INTO Marcas (nombre, pais, createdAt, updatedAt) VALUES 
('Toyota', 'Japón', NOW(), NOW()),
('BMW', 'Alemania', NOW(), NOW()),
('Ford', 'Estados Unidos', NOW(), NOW()),
('Volkswagen', 'Alemania', NOW(), NOW()),
('Mercedes-Benz', 'Alemania', NOW(), NOW());

-- Insertar algunos modelos de ejemplo
INSERT INTO Modelos (nombre, anio, tipo, marcaId, createdAt, updatedAt) VALUES 
('Corolla', 2023, 'sedan', 1, NOW(), NOW()),
('RAV4', 2023, 'suv', 1, NOW(), NOW()),
('X3', 2023, 'suv', 2, NOW(), NOW()),
('Serie 3', 2023, 'sedan', 2, NOW(), NOW()),
('Focus', 2023, 'hatchback', 3, NOW(), NOW());
