import express from 'express'; // Express para poder crear rutas.
import { ProyectoController } from '../controllers/proyectoController.mjs';

// Middleware para verificar la API Key
import { apiKeyMiddleware } from '../middlewares/apiKeyMiddleware.mjs';
// Aseguramos que solo usuarios con rol 'admin' puedan realizar acciones criticas.
import { adminMiddleware } from '../middlewares/adminMiddleware.mjs';

// Router permite agrupar rutas relacionadas y exportarlas como un modulo.
// Esta ruta podra ser utilizada desde otro modulo
const router = express.Router();

// Creamos una instancia del controlador de Proyecto
// Asi se puede acceder a los metodos definidos en ProyectoController
const controller = new ProyectoController();

// ============================================
// RUTAS PROTEGIDAS (requieren API Key)
// ============================================

// Ruta para listar todos los proyectos (GET /api/proyecto)
// apiKeyMiddleware: Validamos que la peticion tenga una ruta valida.
// controller.getAll: Obtenemos todos los proyectos (metodo getAll)
router.get('/', apiKeyMiddleware, controller.getAll);

// Ruta para obtener un proyecto por ID (GET /api/proyecto/:id)
router.get('/:id', apiKeyMiddleware, controller.getById);

// ============================================
// RUTAS ADMINISTRATIVAS (requieren rol admin)
// ============================================

// Ruta para crear un nuevo proyecto (POST /api/proyecto)
//adminMiddleware: Validamos que el usuario tenga el rol de admin
router.post('/', adminMiddleware, controller.create);

// Ruta para actualizar un proyecto por ID (PUT) /api/proyecto/:id)
router.put('/:id', adminMiddleware, controller.update);

// Ruta para eliminar un proyecto por ID (DELETE /api/proyecto/:id)
router.delete('/:id', adminMiddleware, controller.delete);

export default router;