// Importamos el repositorio Proyecto, tiene la conexion directa con Supabase
import { ProyectoRepository } from '../repositories/proyectoRepository.mjs';


// / Exportamos la clase para que pueda ser importada en ROUTES
export class ProyectoController {
     // Creamos una instancia del repositorio para que el controlador pueda obtener loa datos a la base de datos.
    constructor() {
        this.repository = new ProyectoRepository();
    }

    // PETICION GET con metodo repository.findAll()
    getAll = async (req, res) => {
        try {
            // Llamamos al metodo (findAll) del repositorio para traer todos los proyectos.
            const proyectos = await this.repository.findAll();
            // Respondemos con el array con los proyectos transformados a JSON
            res.json({ 
                data: proyectos.map(p => p.toJSON()), 
                message: "Lista de proyectos" 
            });
        } catch (error) {
            res.status(500).json({ error: "ERROR: No se han podido obtener los proyectos", message: error.message });
        }
    };


    //PETICION GET con metodo repository.findById(id)
    getById = async (req, res) => {
        try {
            // Llamada al metodo (findById) del repositorio.
            // req: Petición HTTP que llega al servidor.
            // params: Valores que contiene la URL.
            // id: id del usuario al que se llama. 
            const proyecto = await this.repository.findById(req.params.id);
            if (!proyecto) {
                return res.status(404).json({ error: "ERROR: Proyecto no encontrado." });
            }
            res.json({ data: proyecto.toJSON() });
        } catch (error) {
            res.status(500).json({ error: "ERROR: Error al encontrar el proyecto.", message: error.message });
        }
    };


    //PETICION POST con metodo create(usuarioData)
    create = async (req, res) => {
        try {
            // Llamada al metodo crear del repositorio.
            // Pasamos el cuerpo de la petición (nombre, descripción) al repo
            // body: Informacion con el registro (nombre, estado, etc.)
            const nuevo = await this.repository.create(req.body);
            res.status(201).json({ 
                data: nuevo.toJSON(), // Envio de respuesta al cliente (toJSON = convertir en objeto, JSON = enviar)
                message: "Proyecto creado exitosamente" 
            });
        } catch (error) {
            res.status(400).json({ error: "No se pudo crear el proyecto", message: error.message });
        }
    };

    
    //PETICION PUT con metodo update(id)
    update = async (req, res) => {
        try {
            // Llamada al metodo (update) del repositorio.
            // req: Petición HTTP que llega al servidor.
            // params: Valores que contiene la URL.
            // id: id del usuario al que se llama. 
            const actualizado = await this.repository.update(req.params.id, req.body);
            res.json({ 
                data: actualizado.toJSON(),
                message: "Proyecto actualizado correctamente" 
            });
        } catch (error) {
            res.status(400).json({ error: "ERROR: No se ha podido actualizar", message: error.message });
        }
    };


    //PETICION DELETE con metodo delete(id)
    delete = async (req, res) => {
        try {
            // Llamada al metodo (delete) del repositorio.
            await this.repository.delete(req.params.id);
            res.json({ message: "Proyecto eliminado." });
        } catch (error) {
            res.status(500).json({ error: "ERROR: No se ha podido eliminar", message: error.message });
        }
    };
}