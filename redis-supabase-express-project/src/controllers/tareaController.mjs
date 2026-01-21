// Importamos el repositorio Tarea Repositorio, tiene la conexion directa con Supabase.
import { TareaRepository } from "../repositories/tareaRepository.mjs";

// / Exportamos la clase para que pueda ser importada en ROUTES
export class TareaController {
    
    // Creamos una instancia del repositorio para que el controlador pueda obtener loa datos a la base de datos.
    constructor(){
        this.repository = new TareaRepository()
    }


    // PETICION GET con metodo repository.findAll()
    getAll = async (req, res) => {
        try {
            // Llamamos al metodo (findAll) del repositorio para traer todas las tareas.
            const tareas = await this.repository.findAll();
            // Respondemos con el array de tareas transformadas a JSON
            res.json({ 
                data: tareas.map(t => t.toJSON()), 
                message: "Lista de tareas." 
            });
        } catch (error) {
            res.status(500).json({ error: "ERROR: No se han podido obtener las tareas", message: error.message });
        }
    };


    // PETICION GET con metodo repository.findById(id)
    getById = async (req, res) => {
        try {
            // Llamamos al metodo (findById) para buscar una tarea especifica por su ID.
            const tarea = await this.repository.findById(req.params.id);
            
            if (!tarea) {
                return res.status(404).json({ error: "ERROR: La tarea no ha sido encontrada" });
            }
            res.json({ data: tarea.toJSON() });
        } catch (error) {
            res.status(500).json({ error: "ERROR: Error al buscar la tarea", message: error.message });
        }
    };


    // PETICION GET para filtrar tareas por proyecto
    getByProyecto = async (req, res) => {
        try {
            // Capturamos el proyectoId de la URL y los filtros (como el estado) de la query string
            // Ejemplo: /tareas/proyecto/1?estado=completada
            const { proyectoId } = req.params;
            const filtros = req.query; 

            const tareas = await this.repository.findByProyecto(proyectoId, filtros);
            res.json({ data: tareas.map(t => t.toJSON()) });
        } catch (error) {
            res.status(500).json({ error: "ERROR: Error al filtrar tareas por proyecto", message: error.message });
        }
    };


    // PETICION POST con metodo create(req.body)
    create = async (req, res) => {
        try {
            // Enviamos los datos del cuerpo (titulo, descripcion, proyecto_id) al repositorio.
            const nueva = await this.repository.create(req.body);
            res.status(201).json({ 
                data: nueva.toJSON(), 
                message: "Se ha creado la tarea." 
            });
        } catch (error) {
            res.status(400).json({ error: "ERROR: No se ha podido crear la tarea", message: error.message });
        }
    };


    // PETICION PUT con metodo update(id, data)
    update = async (req, res) => {
        try {
            // Actualizamos los campos enviados (ej: completar tarea o cambiar titulo)
            const actualizada = await this.repository.update(req.params.id, req.body);
            res.json({ 
                data: actualizada.toJSON(), 
                message: "Se ha actualizado la tarea." 
            });
        } catch (error) {
            res.status(400).json({ error: "ERROR: No se ha podido actualizar la tarea", message: error.message });
        }
    };

    
    // PETICION DELETE con metodo delete(id)
    delete = async (req, res) => {
        try {
            // Eliminamos la tarea de la base de datos por su ID
            await this.repository.delete(req.params.id);
            res.json({ message: "La tarea ha sido eliminada." });
        } catch (error) {
            res.status(500).json({ error: "ERROR: No se ha podido eliminar la tarea", message: error.message });
        }
    };
}