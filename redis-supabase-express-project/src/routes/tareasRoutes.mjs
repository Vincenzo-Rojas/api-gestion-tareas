import express from 'express'; // Express para poder crear rutas.
import { TareaController } from '../controllers/tareaController.mjs';

// Middleware para verificar la API Key
import { apiKeyMiddleware } from '../middlewares/apiKeyMiddleware.mjs';
// Aseguramos que solo usuarios con rol 'admin' puedan realizar acciones criticas.
import { adminMiddleware } from '../middlewares/adminMiddleware.mjs';

// Router permite agrupar rutas relacionadas y exportarlas como un modulo.
const router = express.Router();

// Creamos una instancia del controlador de Tarea.
const controller = new TareaController();

// ============================================
// RUTAS PROTEGIDAS (requieren API Key)
// ============================================

// Ruta para listar todas las tareas (GET /api/tareas)
router.get('/', apiKeyMiddleware, controller.getAll);

// Ruta para obtener una tarea por ID (GET /api/tareas/:id)
router.get('/:id', apiKeyMiddleware, controller.getById);

// Ruta para obtener tareas de un proyecto específico (GET /api/tareas/proyecto/:proyectoId)
// Permite filtrar por estado usando query strings: ?estado=pendiente
router.get('/proyecto/:proyectoId', apiKeyMiddleware, controller.getByProyecto);

// ============================================
// RUTAS ADMINISTRATIVAS (requieren rol admin)
// ============================================

// Ruta para crear una nueva tarea (POST /api/tareas)
router.post('/', adminMiddleware, controller.create);

// Ruta para actualizar una tarea por ID (PUT /api/tareas/:id)
router.put('/:id', adminMiddleware, controller.update);

// Ruta para eliminar una tarea por ID (DELETE /api/tareas/:id)
router.delete('/:id', adminMiddleware, controller.delete);

export default router;