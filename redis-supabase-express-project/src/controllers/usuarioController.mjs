import { UsuarioRepository } from '../repositories/usuarioRepository.mjs';

export class UsuarioController {
    constructor() {
        this.repository = new UsuarioRepository();
    }

    // Registro de usuario normal (API Key generada por trigger)
    register = async (req, res) => {
        try {
            const { nombre, email, password } = req.body;

            if (!nombre || !email || !password) {
                return res.status(400).json({
                    error: 'Faltan campos obligatorios: nombre, email, password'
                });
            }

            // Crear usuario
            const nuevoUsuario = await this.repository.create({ nombre, email, password });

            // Obtener la API Key generada por el trigger
            const apiKey = await this.repository.getApiKeyByUserId(nuevoUsuario.id);

            // Devolver datos de usuario + API Key
            res.status(201).json({
                message: 'Usuario registrado exitosamente.',
                data: {
                    ...nuevoUsuario.toPublic(),
                    api_key: apiKey // añadimos la API Key aquí
                },
                info: 'Usa esta API Key en el header X-API-Key para autenticar tus peticiones'
            });
        } catch (error) {
            console.error('Error en register:', error);
            res.status(400).json({
                error: error.message || 'Error al registrar usuario'
            });
        }
    };


    // Obtener usuario por ID
    getById = async (req, res) => {
        try {
            const usuario = await this.repository.findById(req.params.id);
            if (!usuario) return res.status(404).json({ error: "Usuario no encontrado." });

            res.json({ data: usuario.toPublic() }); // solo datos de usuarios
        } catch (error) {
            res.status(500).json({ error: "No se pudo obtener el usuario", message: error.message });
        }
    };

    // Obtener usuario por email
    getByEmail = async (req, res) => {
        try {
            const usuario = await this.repository.findByEmail(req.params.email);
            if (!usuario) return res.status(404).json({ error: "Usuario no encontrado con ese email." });

            res.json({ data: usuario.toPublic() });
        } catch (error) {
            res.status(500).json({ error: "Error buscando usuario por email", message: error.message });
        }
    };

    // Obtener todos los usuarios
    getAll = async (req, res) => {
        try {
            const usuarios = await this.repository.getAll();
            res.json({
                total: usuarios.length,
                data: usuarios.map(u => u.toPublic()) // solo datos de usuarios
            });
        } catch (error) {
            res.status(500).json({ error: "No se pudieron obtener los usuarios", message: error.message });
        }
    };

    // Actualizar usuario
    update = async (req, res) => {
        try {
            const actualizado = await this.repository.update(req.params.id, req.body);
            res.json({ data: actualizado.toPublic(), message: "Usuario actualizado correctamente" });
        } catch (error) {
            res.status(400).json({ error: "No se pudo actualizar usuario", message: error.message });
        }
    };

    // Eliminar / deshabilitar usuario
    disable = async (req, res) => {
        try {
            await this.repository.disable(req.params.id);
            res.json({ message: "Usuario eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ error: "No se pudo eliminar usuario", message: error.message });
        }
    };

    // Obtener tareas asignadas a un usuario
    getTareasUsuario = async (req, res) => {
        try {
            const tareas = await this.repository.getTareas(req.params.id);
            res.json({ total: tareas.length, data: tareas.map(t => t.toJSON()) });
        } catch (error) {
            res.status(500).json({ error: "No se pudieron obtener las tareas del usuario", message: error.message });
        }
    };
}