-- ==============================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS
-- Sistema de Gestión de Vehículos para Concesionarios
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
