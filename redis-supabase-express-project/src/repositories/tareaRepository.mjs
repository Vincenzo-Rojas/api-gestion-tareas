// Importamos la conexión a la base de datos (Supabase):
import { supabase } from '../config/database.mjs';
// Importos el modelo Tarea:
import { Tarea } from '../models/Tarea.mjs';

// Exportamos el repositorio para manejar las operaciones en ba base de datos:
export class TareaRepository {
    

    //Crea una tarea:
    async create(tareaData) {
        // Inserta la tarea en la tabla y devuelve la fila creada
        const { data, error } = await supabase
            .from('tareas') // Tabla tareas
            .insert([tareaData]) // Insertamos los datos
            .select()
            .single(); // Como es solo una fila, la devolvemos como objeto único

        if (error) throw error;
        // Devuelve un objeto Tarea
        return new Tarea(data);
    }


  // Obtenemos todas las tareas
    async findAll() {
        const { data, error } = await supabase
            .from('tareas') // Tabla tareas
            .select('*') // Seleccionamos todos los datos.
            .order('created_at', { ascending: true }); // Ordenanamos por creador de forma ascendente.

        if (error) throw error;

        return data.map(item => new Tarea(item));
    }

    // Obtenemos una tarea por su ID
    async findById(id) {
        const { data, error } = await supabase
            .from('tareas') // Tabla tareas
            .select('*') // Seleccion de todas las tablas.
            .eq('id', id) // Por ID
            .single(); // Al ser una sola fila la devolvemos en unico objeto.

        if (error) throw error;
      
        return new Tarea(data);
    }


    // Obtenemos el proyecto por filtros:
    async findByProyecto(proyectoId, filtros = {}) {
        let query = supabase
            .from('tareas') // Tabla tareas
            .select('*') // Seleccionamos todos los datos
            .eq('proyecto_id', proyectoId); // Filtramos por ID.

        // Obtenemos las tareas con el estado que nos dieron, si nos dieron uno.
        if (filtros.estado) {
            query = query.eq('estado', filtros.estado);
        }
        
        // Ejecutamos la consulta y ordenamos por fecha de creación de manera ascendente.
        const { data, error } = await query.order('created_at', { ascending: true });

        if (error) throw error;
        // Convierte cada fila de la DB en un objeto Tarea y lo devuelve
        return data.map(item => new Tarea(item));
    }


    // Actualizamos una tarea por ID:
    async update(id, updateData) {
        const { data, error } = await supabase
            .from('tareas') // Tabla tareas
            .update(updateData) // Aplicamos cambios.
            .eq('id', id) 
            .select()
            .single();

        if (error) throw error;
        // Devuelve un objeto Tarea
        return new Tarea(data);
    }


    // Elimina una tarea:
    async delete(id, updateData) {
        const { data, error } = await supabase
            .from('tareas') // Tabla tareas
            .update(updateData)
            .delete() // Eliminamos
            .eq('id', id) // Por ID
            .select()
            .single();

        if (error) throw error;

         return new Tarea(data);;
    }
}