// Define todos los endpoints de estadisticas con cache

import express from 'express';
import { EstadisticasController } from '../controllers/estadisticasController.mjs';
import { apiKeyMiddleware } from '../middlewares/apiKeyMiddleware.mjs';
import { adminMiddleware } from '../middlewares/adminMiddleware.mjs';

const router = express.Router();
const controller = new EstadisticasController();

// ============================================
// RUTAS PROTEGIDAS (requieren API Key)
// ============================================

/**
 * GET /api/estadisticas/tareas-por-estado
 * Obtiene cantidad de tareas agrupadas por estado
 * CONSULTA AVANZADA 1: Usa COUNT, GROUP BY
 * Cache: 5 minutos
 * Acceso: Cualquier usuario autenticado
 */
router.get('/tareas-por-estado', apiKeyMiddleware, controller.getTareasPorEstado);

/**
 * GET /api/estadisticas/proyectos-top
 * Obtiene los proyectos con mas tareas
 * CONSULTA AVANZADA 2: Usa JOIN, COUNT, GROUP BY, ORDER BY, LIMIT
 * Query params: ?limite=5 (opcional, default: 5)
 * Cache: 5 minutos
 * Acceso: Cualquier usuario autenticado
 */
router.get('/proyectos-top', apiKeyMiddleware, controller.getProyectosTop);

/**
 * GET /api/estadisticas/generales
 * Obtiene estadisticas generales del sistema
 * Devuelve: total de proyectos, tareas y usuarios
 * Cache: 10 minutos
 * Acceso: Cualquier usuario autenticado
 */
router.get('/generales', apiKeyMiddleware, controller.getEstadisticasGenerales);

/**
 * GET /api/estadisticas/proyecto/:id/tareas
 * Obtiene estadisticas de tareas de un proyecto especifico
 * Params: id del proyecto
 * Cache: 5 minutos
 * Acceso: Cualquier usuario autenticado
 */
router.get('/proyecto/:id/tareas', apiKeyMiddleware, controller.getTareasDeProyecto);

// ============================================
// RUTAS ADMINISTRATIVAS (requieren rol admin)
// ============================================

/**
 * DELETE /api/estadisticas/cache
 * Invalida todo el cache de estadisticas
 * Util cuando se necesita refrescar datos manualmente
 * Acceso: Solo administradores
 */
router.delete('/cache', adminMiddleware, controller.invalidarCache);

export default router;