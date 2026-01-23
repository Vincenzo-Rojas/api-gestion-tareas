// Importamos la conexión a la base de datos Supabase
import { supabase } from '../config/database.mjs';
// Importamos el modelo Usuario y Tarea
import { Usuario } from '../models/Usuario.mjs';
import { Tarea } from '../models/Tarea.mjs';

export class UsuarioRepository {

    // Obtener usuario por ID
    async findById(id) {
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return new Usuario(data);
    }

    // Obtener usuario por email
    async findByEmail(email) {
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !data) return null;
        return new Usuario(data);
    }

    // Obtener todos los usuarios
    async getAll() {
        const { data, error } = await supabase
            .from('usuarios')
            .select('*');

        if (error) throw error;
        return data.map(usuario => new Usuario(usuario));
    }

    // Crear usuario
    async create(usuarioData) {
        const { data: usuario, error } = await supabase
            .from('usuarios')
            .insert([usuarioData])
            .select('*')
            .single();

        if (error) throw error;

        return new Usuario(usuario);
    }

    // Actualizar usuario por ID
    async update(id, updateData) {
        const { data, error } = await supabase
            .from('usuarios')
            .update(updateData)
            .eq('id', id)
            .select('*')
            .single();

        if (error) throw error;
        return new Usuario(data);
    }

    // Eliminar (deshabilitar) usuario por ID
    async disable(id) {
        const { data, error } = await supabase
            .from('usuarios')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data ? new Usuario(data) : null;
    }

    // Obtener tareas asignadas a un usuario (N:M)
    async getTareas(usuarioId) {
        const { data, error } = await supabase
            .from('usuarios_tareas')
            .select('tareas(*)')
            .eq('usuario_id', usuarioId);

        if (error) throw error;
        return data.map(row => new Tarea(row.tareas));
    }

    //Obtener API Key de un usuario por su ID
    async getApiKeyByUserId(usuarioId) {
        const { data, error } = await supabase
            .from('api_keys')
            .select('*')
            .eq('usuario_id', usuarioId)
            .single(); // 1:1 relación

        if (error || !data) return null;

        return data.api_key; // devuelve solo el string de la API Key
    }
}
