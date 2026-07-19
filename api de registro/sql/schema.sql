-- ==========================================
-- ELIMINAR TABLA SI EXISTE (OPCIONAL)
-- ==========================================

DROP TABLE IF EXISTS usuarios;

-- ==========================================
-- CREAR TABLA USUARIOS
-- ==========================================

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- USUARIOS DE PRUEBA (OPCIONAL)
-- ==========================================

INSERT INTO usuarios (nombre, email, password)
VALUES
('Erick', 'erick@gmail.com', '123456'),
('Daniel', 'daniel@gmail.com', '654321');

-- ==========================================
-- CONSULTAR USUARIOS
-- ==========================================

SELECT * FROM usuarios;