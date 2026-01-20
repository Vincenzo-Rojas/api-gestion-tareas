-- ============================================
-- TABLA api_keys
-- ============================================
-- Creamos la tabla api_keys si no existe
-- Esta tabla guarda las claves de API de cada cliente/usuario
CREATE TABLE IF NOT EXISTS api_keys (
  id SERIAL PRIMARY KEY,             -- Identificador único auto-incremental
  api_key UUID UNIQUE NOT NULL,      -- Clave de API única
  client_name VARCHAR(255) NOT NULL, -- Nombre del cliente/usuario
  email VARCHAR(255) NOT NULL,       -- Email del cliente/usuario
  role VARCHAR(50) DEFAULT 'user'    -- Rol del usuario ('user' o 'admin')
       CHECK (role IN ('user', 'admin')),
  is_active BOOLEAN DEFAULT true,    -- Estado activo/inactivo de la clave
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Fecha de creación
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()  -- Fecha de última actualización
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_api_keys_api_key ON api_keys(api_key);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_api_keys_role ON api_keys(role);

-- ============================================
-- TRIGGER PARA ACTUALIZAR updated_at
-- ============================================
-- Creamos función para actualizar updated_at automáticamente al modificar filas
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW(); -- Asigna la fecha y hora actual
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Creamos trigger para la tabla api_keys
CREATE TRIGGER update_api_keys_updated_at 
BEFORE UPDATE ON api_keys
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- TABLA usuarios
-- ============================================
-- Tabla de usuarios del sistema
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,            -- Identificador único del usuario
  nombre VARCHAR(100) NOT NULL,    -- Nombre del usuario
  email VARCHAR(255) NOT NULL UNIQUE, -- Email único
  password VARCHAR(255) NOT NULL,  -- Contraseña del usuario
  created_at TIMESTAMP DEFAULT NOW(), -- Fecha de creación
  updated_at TIMESTAMP DEFAULT NOW()  -- Fecha de última actualización
);

-- ============================================
-- TABLA proyectos
-- ============================================
-- Tabla de proyectos
CREATE TABLE IF NOT EXISTS proyectos (
  id SERIAL PRIMARY KEY,           -- Identificador único del proyecto
  nombre VARCHAR(100) NOT NULL,   -- Nombre del proyecto
  descripcion TEXT,               -- Descripción opcional
  created_at TIMESTAMP DEFAULT NOW(), -- Fecha de creación
  updated_at TIMESTAMP DEFAULT NOW()  -- Fecha de última actualización
);

-- ============================================
-- TABLA tareas
-- ============================================
-- Tabla de tareas asociadas a proyectos
CREATE TABLE IF NOT EXISTS tareas (
  id SERIAL PRIMARY KEY,                     -- Identificador único de la tarea
  titulo VARCHAR(255) NOT NULL,             -- Título de la tarea
  descripcion TEXT,                         -- Descripción opcional
  estado VARCHAR(50) DEFAULT 'pendiente'   -- Estado de la tarea
         CHECK (estado IN ('pendiente', 'en progreso', 'completada', 'cancelada')),
  proyecto_id INTEGER REFERENCES proyectos(id) ON DELETE CASCADE, -- Proyecto asociado
  created_at TIMESTAMP DEFAULT NOW(),       -- Fecha de creación
  updated_at TIMESTAMP DEFAULT NOW()        -- Fecha de última actualización
);

-- ============================================
-- TABLA intermedia usuarios_tareas (N:M)
-- ============================================
-- Relaciona usuarios con tareas (un usuario puede tener muchas tareas y viceversa)
CREATE TABLE IF NOT EXISTS usuarios_tareas (
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE, -- Usuario asociado
  tarea_id INTEGER REFERENCES tareas(id) ON DELETE CASCADE,    -- Tarea asociada
  PRIMARY KEY(usuario_id, tarea_id)                             -- Clave primaria compuesta
);

-- ============================================
-- TRIGGERS updated_at para otras tablas
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

-- Usuarios_Tareas no necesita trigger porque solo almacena relaciones


-- ============================================
-- DATOS DE EJEMPLO
-- ============================================
-- Insertar admin de prueba (opcional)
INSERT INTO api_keys (api_key, client_name, email, role) 
VALUES (
   gen_random_uuid(), -- Genera UUID
   'Admin',           -- Nombre cliente
   'admin@example.com', -- Email
   'admin'            -- Rol admin
);

-- Insertar usuario normal de prueba (opcional)
INSERT INTO api_keys (api_key, client_name, email, role) 
VALUES (
   gen_random_uuid(),
   'Usuario de Prueba',
   'user@example.com',
   'user'
);

-- Insertar usuarios de ejemplo
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

-- Insertar proyectos de ejemplo
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

-- Insertar tareas de ejemplo
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

-- Insertar relaciones usuarios_tareas de ejemplo
INSERT INTO usuarios_tareas (usuario_id, tarea_id) VALUES
(1,1),(1,2),(2,3),(2,4),(3,5),
(3,6),(4,7),(4,8),(5,9),(5,10),
(6,1),(6,3),(7,2),(7,4),(8,5),
(8,7),(9,6),(9,8),(10,9),(10,10);

-- ============================================
-- Generar api_keys para usuarios existentes
-- ============================================
-- Para cada usuario que no tenga ya una api_key se genera una nueva
INSERT INTO api_keys (api_key, client_name, email, role)
SELECT 
    gen_random_uuid(), -- UUID aleatorio
    nombre,            -- Nombre del usuario
    email,             -- Email del usuario
    'user'             -- Rol por defecto
FROM usuarios u
WHERE NOT EXISTS (
    SELECT 1 
    FROM api_keys a
    WHERE a.email = u.email
);
