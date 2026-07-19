-- ==========================================
-- CREAR BASE DE DATOS
-- ==========================================

CREATE DATABASE login_api;

-- Conéctate a la base de datos login_api antes de ejecutar el resto del script.

-- ==========================================
-- CREAR TABLA USUARIOS
-- ==========================================

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- USUARIO DE PRUEBA
-- ==========================================

INSERT INTO usuarios (nombre, email, password)
VALUES (
    'Erick',
    'erick@gmail.com',
    '123456'
);