import express from 'express'; // Express para poder crear rutas.
import { UsuarioController } from '../controllers/usuarioController.mjs';

// Middleware para verificar la API Key
import { apiKeyMiddleware } from '../middlewares/apiKeyMiddleware.mjs';
// Aseguramos que solo usuarios con rol 'admin' puedan realizar acciones criticas.
import { adminMiddleware } from '../middlewares/adminMiddleware.mjs';

// Router permite agrupar rutas relacionadas y exportarlas como un modulo.
// Esta ruta podra ser utilizada desde otro modulo
const router = express.Router();

// Creamos una instancia del controlador de Usuario
// Asi se puede acceder a los metodos definidos en UsuarioController
const controller = new UsuarioController();

// ============================================
// RUTAS PROTEGIDAS (requieren API Key)
// ============================================

// Ruta para obtener un usuario por ID (GET /api/usuarios/:id)
// apiKeyMiddleware: Validamos que la peticion tenga una ruta valida.
router.get('/:id', apiKeyMiddleware, controller.getById);

// Ruta para obtener un usuario por Email (GET /api/usuarios/email/:email)
router.get('/email/:email', apiKeyMiddleware, controller.getByEmail);

// ============================================
// RUTAS ADMINISTRATIVAS (requieren rol admin)
// ============================================

// Ruta para crear un nuevo usuario (POST /api/usuarios)
// adminMiddleware: Validamos que el usuario tenga el rol de admin
router.post('/', adminMiddleware, controller.create);

// Ruta para actualizar un usuario por ID (PUT /api/usuarios/:id)
router.put('/:id', adminMiddleware, controller.update);

// Ruta para deshabilitar un usuario por ID (DELETE /api/usuarios/:id)
// Usamos el metodo disable() internamente en el controlador.
router.delete('/:id', adminMiddleware, controller.disable);

export default router;