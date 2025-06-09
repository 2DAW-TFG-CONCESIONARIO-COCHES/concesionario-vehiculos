-- ==============================================
-- SCRIPT COMPLETO DE CONFIGURACIÓN
-- Este archivo ejecuta todos los scripts en orden
-- ==============================================

-- Ejecutar todos los scripts en orden
SOURCE 01-create-database.sql;
SOURCE 02-create-tables.sql;
SOURCE 03-insert-sample-data.sql;
SOURCE 04-create-views.sql;
SOURCE 05-create-procedures.sql;
SOURCE 06-create-triggers.sql;

-- Mostrar resumen de la configuración
USE concesionario_db;

SELECT 'Base de datos configurada correctamente' as status;

-- Mostrar estadísticas iniciales
SELECT 
    (SELECT COUNT(*) FROM Usuarios) as total_usuarios,
    (SELECT COUNT(*) FROM Marcas) as total_marcas,
    (SELECT COUNT(*) FROM Modelos) as total_modelos,
    (SELECT COUNT(*) FROM Vehiculos) as total_vehiculos;

-- Mostrar las tablas creadas
SHOW TABLES;
