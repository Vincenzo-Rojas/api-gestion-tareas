import express from 'express';
import { UsuarioController } from '../controllers/UsuarioController.mjs';
import { apiKeyMiddleware } from '../middlewares/apiKeyMiddleware.mjs';
import { adminMiddleware } from '../middlewares/adminMiddleware.mjs';

const router = express.Router();
const controller = new UsuarioController();

// ============================================
// RUTAS PÚBLICAS
// ============================================

/**
 * POST /api/usuarios/register
 * Registra un nuevo cliente y genera una API Key automáticamente
 */
router.post('/register', controller.register);

// ============================================
// RUTAS PROTEGIDAS (requieren API Key)
// ============================================

// Obtener todos los usuarios
router.get('/', apiKeyMiddleware, controller.getAll);

// Obtener un usuario por email
router.get('/email/:email', apiKeyMiddleware, controller.getByEmail);

// Obtener un usuario por ID
router.get('/:id', apiKeyMiddleware, controller.getById);

// Obtener tareas asignadas a un usuario
router.get('/:id/tareas', apiKeyMiddleware, controller.getTareasUsuario);

// ============================================
// RUTAS ADMINISTRATIVAS (requieren rol admin)
// ============================================

// Crear un nuevo usuario
router.post('/', adminMiddleware, controller.create);

// Actualizar un usuario por ID
router.put('/:id', adminMiddleware, controller.update);

// Deshabilitar un usuario por ID
router.delete('/:id', adminMiddleware, controller.disable);

export default router;
