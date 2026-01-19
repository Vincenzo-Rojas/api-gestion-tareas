-- Script SQL para crear la tabla api_keys en Supabase
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase

-- Tabla api_keys (existente, opcional)
CREATE TABLE IF NOT EXISTS api_keys (
  id SERIAL PRIMARY KEY,
  api_key UUID UNIQUE NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_api_key ON api_keys(api_key);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_api_keys_role ON api_keys(role);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_api_keys_updated_at 
BEFORE UPDATE ON api_keys
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- TABLAS DEL PROYECTO
-- ============================================

-- Tabla Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla Proyectos
CREATE TABLE IF NOT EXISTS proyectos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla Tareas
CREATE TABLE IF NOT EXISTS tareas (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  estado VARCHAR(50) DEFAULT 'pendiente' 
         CHECK (estado IN ('pendiente', 'en progreso', 'completada', 'cancelada')),
  proyecto_id INTEGER REFERENCES proyectos(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


-- Tabla intermedia Usuarios_Tareas (relación N:M)
CREATE TABLE IF NOT EXISTS usuarios_tareas (
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  tarea_id INTEGER REFERENCES tareas(id) ON DELETE CASCADE,
  PRIMARY KEY(usuario_id, tarea_id)
);

-- ============================================
-- Triggers para actualizar updated_at automáticamente
-- ============================================

-- Usuarios
CREATE TRIGGER update_usuarios_updated_at 
BEFORE UPDATE ON usuarios
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Proyectos
CREATE TRIGGER update_proyectos_updated_at 
BEFORE UPDATE ON proyectos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tareas
CREATE TRIGGER update_tareas_updated_at 
BEFORE UPDATE ON tareas
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Usuarios_Tareas no necesita trigger porque es solo relación

-- ============================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ============================================

-- Insertar un administrador de ejemplo para pruebas (opcional)
-- Descomenta las siguientes líneas para crear un admin de prueba
INSERT INTO api_keys (api_key, client_name, email, role) 
VALUES (
   gen_random_uuid(), 
   'Admin', 
   'admin@example.com',
   'admin'
 );

-- Insertar un usuario normal de ejemplo (opcional)
 INSERT INTO api_keys (api_key, client_name, email, role) 
 VALUES (
   gen_random_uuid(), 
   'Usuario de Prueba', 
   'user@example.com',
   'user'
 );

-- Datos de ejemplo para usuarios
INSERT INTO usuarios (nombre, email, password) VALUES
('Alice', 'alice@example.com', 'password1'),
('Bob', 'bob@example.com', 'password2'),
('Carlos', 'carlos@example.com', 'password3'),
('Diana', 'diana@example.com', 'password4'),
('Elena', 'elena@example.com', 'password5'),
('Fernando', 'fernando@example.com', 'password6'),
('Gabriela', 'gabriela@example.com', 'password7'),
('Hugo', 'hugo@example.com', 'password8'),
('Isabel', 'isabel@example.com', 'password9'),
('Juan', 'juan@example.com', 'password10');

-- Datos de ejemplo para proyectos
INSERT INTO proyectos (nombre, descripcion) VALUES
('Proyecto A', 'Descripción proyecto A'),
('Proyecto B', 'Descripción proyecto B'),
('Proyecto C', 'Descripción proyecto C'),
('Proyecto D', 'Descripción proyecto D'),
('Proyecto E', 'Descripción proyecto E'),
('Proyecto F', 'Descripción proyecto F'),
('Proyecto G', 'Descripción proyecto G'),
('Proyecto H', 'Descripción proyecto H'),
('Proyecto I', 'Descripción proyecto I'),
('Proyecto J', 'Descripción proyecto J');

-- Datos de ejemplo para tareas
INSERT INTO tareas (titulo, descripcion, estado, proyecto_id) VALUES
('Tarea 1', 'Descripción Tarea 1', 'pendiente', 1),
('Tarea 2', 'Descripción Tarea 2', 'pendiente', 1),
('Tarea 3', 'Descripción Tarea 3', 'pendiente', 2),
('Tarea 4', 'Descripción Tarea 4', 'pendiente', 2),
('Tarea 5', 'Descripción Tarea 5', 'pendiente', 3),
('Tarea 6', 'Descripción Tarea 6', 'pendiente', 3),
('Tarea 7', 'Descripción Tarea 7', 'pendiente', 4),
('Tarea 8', 'Descripción Tarea 8', 'pendiente', 4),
('Tarea 9', 'Descripción Tarea 9', 'pendiente', 5),
('Tarea 10', 'Descripción Tarea 10', 'pendiente', 5);

-- Datos de ejemplo para usuarios_tareas
INSERT INTO usuarios_tareas (usuario_id, tarea_id) VALUES
(1,1),(1,2),(2,3),(2,4),(3,5),
(3,6),(4,7),(4,8),(5,9),(5,10),
(6,1),(6,3),(7,2),(7,4),(8,5),
(8,7),(9,6),(9,8),(10,9),(10,10);