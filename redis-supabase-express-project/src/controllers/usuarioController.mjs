// Importamos el repositorio Usuario Repositorio, tiene la conexion directa con Supabase.
// Controladores que manejan las peticiones HTTP
import { UsuarioRepository } from '../repositories/usuarioRepository.mjs';

// / Exportamos la clase para que pueda ser importada en ROUTES
export class UsuarioController {
    // Creamos una instancia del repositorio para que el controlador pueda obtener loa datos a la base de datos.
    constructor() {
        this.repository = new UsuarioRepository();
    }

     /**
     * POST /api/register
     * Registra un nuevo usuario normal.
     * La API Key se genera automáticamente mediante el trigger de la base de datos.
     */
    register = async (req, res) => {
        try {
            const { client_name, email } = req.body;

            // Validación mínima
            if (!client_name || !email) {
                return res.status(400).json({
                    error: 'Faltan campos obligatorios: client_name y email'
                });
            }

            // Creamos el usuario con rol 'user' (normal)
            const nuevoUsuario = await this.repository.create({
                client_name,
                email,
                role: 'user' // forzamos rol normal
            });

            // Devolvemos info, incluyendo la API Key generada por el trigger
            res.status(201).json({
                message: 'Usuario registrado exitosamente. La API Key se genera automáticamente.',
                data: {
                    client_name: nuevoUsuario.client_name,
                    email: nuevoUsuario.email,
                    role: nuevoUsuario.role,
                    api_key: nuevoUsuario.api_key, // viene del trigger
                    created_at: nuevoUsuario.created_at
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

    // PETICION GET con metodo usuarioRepository.findById()
    getById = async (req, res) => {
         try {
            // Llamamos al metodo (findById) del repositorio para traer al usuario.
            const usuario = await this.repository.findById(req.params.id);
            
            if(!usuario){
                return res.status(404).json({error: "ERROR: Usuario no encontrado."});
            }
            // Respondemos con los datos del usuario transformados a JSON
            res.json({data: usuario.toJSON()});
        } catch (error) {
            res.status(500).json({ error: "ERROR: No se ha podido encontrar al usuario", message: error.message });
        }
    };


    // PETICION GET con metodo usuarioRepository.findByEmail()
    getByEmail = async (req, res) => {
        try {
            // Llamamos al metodo (findByEmail) del repositorio usando el email que viene en la URL.
            // req.params.email: Captura el correo de la ruta (ej: /usuarios/email/email@email.com)
            const usuario = await this.repository.findByEmail(req.params.email);

            if (!usuario) {
                return res.status(404).json({ error: "ERROR: Usuario no encontrado con ese email." });
            }

            // Respondemos con los datos del usuario transformados a JSON
            res.json({ data: usuario.toJSON() });
        } catch (error) {
            res.status(500).json({ 
                error: "ERROR: No se ha podido realizar la búsqueda por email", 
                message: error.message 
            });
        }
    };

    
    // PETICION POST con metodo create(req.body)
    create = async (req, res) => {
        try {
            // Enviamos el cuerpo de la petición (nombre, email, password) al repositorio para insertarlo.
            const nuevo = await this.repository.create(req.body);

            // Si la inserción es exitosa, devolvemos cod: 201 (Created).
            res.status(201).json({ 
                data: nuevo.toJSON(), 
                message: "Se ha creado el usuario." 
            });
        } catch (error) {
            // Si existe un error:
            res.status(400).json({ 
                error: "ERROR: No se ha podido crear el usuario", 
                message: error.message 
            });
        }
    };


    // PETICION PUT con metodo update(id)
    update = async (req, res) => {
        try {
            // Llamada al metodo (update) del repositorio.
            // req: Petición HTTP que llega al servidor.
            // params: Valores que contiene la URL.
            // id: id del usuario al que se llama. 
            const actualizado = await this.repository.update(req.params.id, req.body);
            res.json({ 
                data: actualizado.toJSON(),
                message: "Usuario actualizado correctamente" 
            });
        } catch (error) {
            res.status(400).json({ error: "ERROR: No se ha podido actualizar", message: error.message });
        }
    };


    // PETICION DELETE con metodo delete(id)
    disable = async (req, res) => {
        try {
            // Llamada al metodo (disable).
            await this.repository.disable(req.params.id);
            res.json({ message: "El usuario ha sido deshabilitado." });
        } catch (error) {
            res.status(500).json({ error: "ERROR: No se ha podido deshabilitar al usuario", message: error.message });
        }
    };
}