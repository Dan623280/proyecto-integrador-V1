CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS proyectos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nombre VARCHAR(180) NOT NULL,
    descripcion TEXT NOT NULL,
    dificultad VARCHAR(30) NOT NULL,
    duracion_estimada VARCHAR(50),
    objetivo TEXT,
    requisitos JSONB NOT NULL DEFAULT '[]'::jsonb,
    archivos JSONB NOT NULL DEFAULT '[]'::jsonb,
    estado VARCHAR(30) NOT NULL DEFAULT 'propuesto'
        CHECK (estado IN ('propuesto','aceptado','rechazado','entregado','evaluado')),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_proyectos_usuario ON proyectos(usuario_id);

CREATE TABLE IF NOT EXISTS entregas (
    id SERIAL PRIMARY KEY,
    proyecto_id INTEGER NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
    nombre_archivo VARCHAR(255) NOT NULL,
    contenido_codigo TEXT NOT NULL,
    fecha_entrega TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_entregas_proyecto ON entregas(proyecto_id);

CREATE TABLE IF NOT EXISTS evaluaciones (
    id SERIAL PRIMARY KEY,
    entrega_id INTEGER NOT NULL UNIQUE REFERENCES entregas(id) ON DELETE CASCADE,
    reporte TEXT NOT NULL,
    calificacion NUMERIC(5,2) CHECK (calificacion BETWEEN 0 AND 100),
    fecha_evaluacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
