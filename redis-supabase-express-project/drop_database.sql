-- ============================================
-- SCRIPT DE ELIMINACIÓN COMPLETA DE TABLAS
-- ⚠️ ADVERTENCIA: Esto eliminará TODOS los datos
-- ============================================

-- Eliminar la tabla intermedia usuarios_tareas primero (N:M)
DROP TABLE IF EXISTS usuarios_tareas CASCADE;

-- Eliminar tabla tareas
DROP TABLE IF EXISTS tareas CASCADE;

-- Eliminar tabla proyectos
DROP TABLE IF EXISTS proyectos CASCADE;

-- Eliminar api_keys
DROP TABLE IF EXISTS api_keys CASCADE;

-- Eliminar usuarios
DROP TABLE IF EXISTS usuarios CASCADE;

-- Eliminar funciones de triggers si existen
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS crear_api_key_usuario() CASCADE;

-- Confirmación en consola
DO $$
BEGIN
    RAISE NOTICE '✅ Todas las tablas (usuarios, api_keys, proyectos, tareas, usuarios_tareas) eliminadas';
    RAISE NOTICE '✅ Todas las funciones de triggers eliminadas';
    RAISE NOTICE '⚠️ La base de datos ha sido limpiada completamente';
END $$;
