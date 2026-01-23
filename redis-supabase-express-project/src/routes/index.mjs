// Monta todas las rutas de la aplicacion

import express from 'express';
import apiKeyRoutes from './apiKeyRoutes.mjs';
import proyectoRoutes from './proyectoRoutes.mjs';
import usuarioRoutes from './usuarioRoutes.mjs';
import estadisticasRoutes from './estadisticasRoutes.mjs';
import tareaRoutes from './tareasRoutes.mjs';

const router = express.Router();

// ============================================
// MONTAR RUTAS
// ============================================

// Rutas de autenticacion y API Keys
router.use('/', apiKeyRoutes);

// Rutas de entidades de negocio
router.use('/proyectos', proyectoRoutes);
router.use('/usuarios', usuarioRoutes);

// Rutas de estadisticas (NUEVO - Parte de Diego)
router.use('/estadisticas', estadisticasRoutes);

// Rutas de tareas.
router.use('/tareas', tareaRoutes);

// ============================================
// RUTA RAIZ - Informacion de la API
// ============================================

router.get('/', (req, res) => {
  res.json({
    name: 'API de Gestion de Tareas y Proyectos',
    version: '1.0.0',
    description: 'API REST con autenticacion por API Key, cache con Redis y base de datos PostgreSQL',
    endpoints: {
      public: [
        'POST /api/register - Registrar y obtener nueva API Key'
      ],
      protected: [
        'GET /api/protected/data - Datos protegidos (requiere API Key)',
        'GET /api/protected/me - Info del cliente (requiere API Key)'
      ],
      proyectos: [
        'GET /api/proyectos - Listar todos los proyectos',
        'GET /api/proyectos/:id - Obtener proyecto por ID',
        'POST /api/proyectos - Crear nuevo proyecto (admin)',
        'PUT /api/proyectos/:id - Actualizar proyecto (admin)',
        'DELETE /api/proyectos/:id - Eliminar proyecto (admin)'
      ],
      usuarios: [
        'GET /api/usuarios - Listar todos los usuarios',
        'GET /api/usuarios/:id - Obtener usuario por ID',
        'GET /api/usuarios/email/:email - Obtener usuario por email',
        'POST /api/usuarios - Crear nuevo usuario (admin)',
        'PUT /api/usuarios/:id - Actualizar usuario (admin)',
        'DELETE /api/usuarios/:id - Deshabilitar usuario (admin)'
      ],
      estadisticas: [
        'GET /api/estadisticas/tareas-por-estado - Tareas agrupadas por estado (con cache)',
        'GET /api/estadisticas/proyectos-top?limite=5 - Top proyectos con mas tareas (con cache)',
        'GET /api/estadisticas/generales - Estadisticas generales del sistema (con cache)',
        'GET /api/estadisticas/proyecto/:id/tareas - Tareas de un proyecto por estado (con cache)',
        'DELETE /api/estadisticas/cache - Invalidar cache de estadisticas (admin)'
      ],
      tareas: [
        'GET /api/tareas - Listar todas las tareas',
        'GET /api/tareas/:id - Obtener tarea por ID',
        'GET /api/tareas/proyecto/:proyectoId?estado=pendiente - Tareas de un proyecto',
        'POST /api/tareas - Crear nueva tarea (admin)',
        'PUT /api/tareas/:id - Actualizar tarea (admin)',
        'DELETE /api/tareas/:id - Eliminar tarea (admin)'
      ],
      admin: [
        'GET /api/admin/keys - Listar todas las API Keys',
        'PUT /api/admin/keys/:apiKey/deactivate - Desactivar API Key',
        'PUT /api/admin/keys/:apiKey/activate - Activar API Key'
      ]
    },
    usage: {
      header: 'X-API-Key',
      example: 'X-API-Key: tu-uuid-aqui'
    },
    features: [
      'Autenticacion con API Keys',
      'Rate limiting (10 req/min por API Key)',
      'Cache con Redis (TTL: 5-10 minutos)',
      'Consultas avanzadas con agregaciones',
      'Arquitectura en capas (routes -> controllers -> services -> repositories)'
    ]
  });
});

export default router;