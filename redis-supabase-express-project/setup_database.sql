-- ============================================
-- FUNCIÓN GENÉRICA updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TABLA usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_usuarios_updated_at
BEFORE UPDATE ON usuarios
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLA api_keys (1:1 con usuarios)
-- ============================================
CREATE TABLE IF NOT EXISTS api_keys (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL UNIQUE,
  api_key UUID UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'user'
       CHECK (role IN ('user', 'admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT fk_api_keys_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_api_keys_api_key ON api_keys(api_key);
CREATE INDEX IF NOT EXISTS idx_api_keys_usuario_id ON api_keys(usuario_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_api_keys_role ON api_keys(role);

CREATE TRIGGER update_api_keys_updated_at
BEFORE UPDATE ON api_keys
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TRIGGER: crear API Key al crear usuario
-- ============================================
CREATE OR REPLACE FUNCTION crear_api_key_usuario()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO api_keys (usuario_id, api_key, role)
  VALUES (
    NEW.id,
    gen_random_uuid(),
    'user'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_crear_api_key
AFTER INSERT ON usuarios
FOR EACH ROW
EXECUTE FUNCTION crear_api_key_usuario();

-- ============================================
-- TABLA proyectos
-- ============================================
CREATE TABLE IF NOT EXISTS proyectos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_proyectos_updated_at
BEFORE UPDATE ON proyectos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLA tareas
-- ============================================
CREATE TABLE IF NOT EXISTS tareas (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  estado VARCHAR(50) DEFAULT 'pendiente'
    CHECK (estado IN ('pendiente', 'en progreso', 'completada', 'cancelada')),
  proyecto_id INTEGER REFERENCES proyectos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_tareas_updated_at
BEFORE UPDATE ON tareas
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLA usuarios_tareas (N:M)
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios_tareas (
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  tarea_id INTEGER REFERENCES tareas(id) ON DELETE CASCADE,
  PRIMARY KEY (usuario_id, tarea_id)
);

-- ============================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ============================================

INSERT INTO usuarios (nombre, email, password) VALUES
('Admin', 'admin@example.com', 'adminpass'),
('Alice', 'alice@example.com', 'password1'),
('Bob', 'bob@example.com', 'password2');

-- Convertir manualmente al primer usuario en admin
UPDATE api_keys
SET role = 'admin'
WHERE usuario_id = 1;

INSERT INTO proyectos (nombre, descripcion) VALUES
('Proyecto A', 'Descripción proyecto A'),
('Proyecto B', 'Descripción proyecto B'),
('Aplicación Móvil Ventas', 'Desarrollo de una app móvil para gestionar ventas'),
('Migración Base de Datos', 'Migrar la base de datos a PostgreSQL 15'),
('Campaña Marketing Enero', 'Planificación y ejecución de la campaña de marketing de enero'),
('Rediseño Web Corporativa', 'Actualizar la web corporativa con nuevo diseño y SEO'),
('Automatización Facturación', 'Implementar sistema de facturación automática');

INSERT INTO tareas (titulo, descripcion, estado, proyecto_id) VALUES
('Tarea 1', 'Descripción Tarea 1', 'pendiente', 1),
('Tarea 2', 'Descripción Tarea 2', 'pendiente', 2),
('Diseñar interfaz usuario', 'Crear wireframes y mockups para la app móvil', 'pendiente', 1),
('Desarrollar API REST', 'Implementar endpoints para el app móvil', 'en progreso', 1),
('Test migración de datos', 'Probar integridad y consistencia de la base de datos', 'pendiente', 2),
('Actualizar scripts SQL', 'Optimizar consultas y triggers para la nueva DB', 'en progreso', 2),
('Crear contenido campaña', 'Redactar emails y posts para la campaña de marketing', 'completada', 3),
('Programar envíos automáticos', 'Configurar herramientas para envíos masivos', 'pendiente', 3),
('Maquetar nueva web', 'Implementar HTML, CSS y JS siguiendo nuevo diseño', 'en progreso', 4),
('Optimizar SEO', 'Mejorar posicionamiento en buscadores', 'pendiente', 4),
('Integrar sistema de pagos', 'Conectar la facturación con la pasarela de pagos', 'cancelada', 5),
('Generar reportes automáticos', 'Automatizar reportes semanales de facturación', 'en progreso', 5);

INSERT INTO usuarios_tareas (usuario_id, tarea_id) VALUES
(2, 1),
(3, 2);
