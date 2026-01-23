// Importamos la conexión a la base de datos (Supabase):
import { supabase } from '../config/database.mjs';
// Importos el modelo Usuario:
import { Usuario } from '../models/Usuario.mjs';

// Exportamos el repositorio para manejar las operaciones en ba base de datos:
export class UsuarioRepository {


    // Obtenemos el usuario por ID:
    async findById(id) {
        const { data, error } = await supabase
            .from('usuarios') // Tabla usuarios
            .select('*') // Seleccionamos todos los datos
            .eq('id', id) // Filtramos por ID.
            .single(); // Devolvemos como objeto unico al ser solo una fila.

        if (error) return null;
        // Devuelvemos el objeto usuario.
        return new Usuario(data);
    }


    // Buscamos un usuario por email:
    async findByEmail(email) {
        const { data, error } = await supabase
            .from('usuarios') // Tabla usuarios
            .select('*') // Seleccionamos todos los datos
            .eq('email', email) // Filtramos por EMAIL.
            .single();

        if (error) return null;
        // Devolvemos el objeto usuario.
        return new Usuario(data);
    }


    // Creamos un usuario:
    async create(usuarioData) {
        const { data, error } = await supabase
            .from('usuarios') // Tabla usuarios
            .insert([usuarioData]) // Insertamos los datos.
            .select()
            .single();

        if (error) throw error;
        // Devolvemos el objeto usuario.
        return new Usuario(data);
    }


    // Actualizamos un usuario por ID:
    async update(id, updateData) {
        const { data, error } = await supabase
            .from('usuarios') // Tabla usuarios
            .update(updateData) // Aplicamos cambios.
            .eq('id', id) // Filtrar por ID usuario.
            .select()
            .single();
    
        if (error) throw error;
        // Devuelve un objeto Tarea
        return new Usuario(data);
    }


    // Eliminamos un usuario:
    async disable(id) {
        const { data, error } = await supabase
            .from('usuarios') // Tabla usuarios
            .delete() // ELIMINAMOS el registro
            .eq('id', id) // Filtramos por ID.
            .select()
            .single();
            
        if (error) throw error;

        return data ? new Usuario(data) : null;
    }
}