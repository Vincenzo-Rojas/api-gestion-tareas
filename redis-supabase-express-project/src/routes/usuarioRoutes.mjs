import express from 'express'; // Express para poder crear rutas.
import { UsuarioController } from '../controllers/usuarioController.mjs';

// Middleware para verificar la API Key
import { apiKeyMiddleware } from '../middlewares/apiKeyMiddleware.mjs';
// Aseguramos que solo usuarios con rol 'admin' puedan realizar acciones criticas.
import { adminMiddleware } from '../middlewares/adminMiddleware.mjs';

// Router permite agrupar rutas relacionadas y exportarlas como un modulo.
const router = express.Router();

// Creamos una instancia del controlador de Usuario
const controller = new UsuarioController();

// ============================================
// RUTAS PÚBLICAS
// ============================================

/**
 * POST /api/register
 * Registra un nuevo cliente y genera una API Key
 */
router.post('/register', controller.register);

// ============================================
// RUTAS PROTEGIDAS (requieren API Key)
// ============================================

// Obtener todos los usuarios (GET /api/usuarios)
router.get('/', apiKeyMiddleware, controller.getAll);

// Obtener un usuario por email (GET /api/usuarios/email/:email)
router.get('/email/:email', apiKeyMiddleware, controller.getByEmail);

// Obtener un usuario por ID (GET /api/usuarios/:id)
router.get('/:id', apiKeyMiddleware, controller.getById);

// ============================================
// RUTAS ADMINISTRATIVAS (requieren rol admin)
// ============================================

// Crear un nuevo usuario (POST /api/usuarios)
router.post('/', adminMiddleware, controller.create);

// Actualizar un usuario por ID (PUT /api/usuarios/:id)
router.put('/:id', adminMiddleware, controller.update);

// Deshabilitar un usuario por ID (DELETE /api/usuarios/:id)
router.delete('/:id', adminMiddleware, controller.disable);

export default router;