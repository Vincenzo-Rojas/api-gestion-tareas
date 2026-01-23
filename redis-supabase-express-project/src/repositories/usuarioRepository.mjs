// Importamos la conexión a la base de datos Supabase
import { supabase } from '../config/database.mjs';
// Importamos el modelo Usuario y Tarea
import { Usuario } from '../models/Usuario.mjs';
import { Tarea } from '../models/Tarea.mjs';

export class UsuarioRepository {

    // Obtener usuario por ID, incluyendo su API Key
    async findById(id) {
        const { data, error } = await supabase
            .from('usuarios')
            .select(`
                *,
                api_keys(*)
            `)
            .eq('id', id)
            .single();

        if (error) return null;
        return new Usuario(data);
    }

    // Obtener usuario por email, incluyendo API Key
    async findByEmail(email) {
        const { data, error } = await supabase
            .from('usuarios')
            .select(`
                *,
                api_keys(*)
            `)
            .eq('email', email)
            .single();

        if (error) return null;
        return new Usuario(data);
    }

    // Obtener todos los usuarios
    async getAll() {
        const { data, error } = await supabase
            .from('usuarios')
            .select(`
                *,
                api_keys(*)
            `);

        if (error) throw error;
        return data.map(usuario => new Usuario(usuario));
    }

    // Crear usuario y traer API Key generada por trigger
async create(usuarioData) {
    // Insertar el usuario
    const { data: usuario, error } = await supabase
        .from('usuarios')
        .insert([usuarioData])
        .select('*')
        .single();
    if (error) throw error;

    // Traer la API Key creada por el trigger
    const { data: apiKeyData, error: keyError } = await supabase
        .from('api_keys')
        .select('*')
        .eq('usuario_id', usuario.id)
        .single();
    if (keyError) throw keyError;

    // Combinar datos y devolver
    return new Usuario({
        ...usuario,
        api_key: apiKeyData.api_key
    });
}


    // Actualizar usuario por ID
    async update(id, updateData) {
        const { data, error } = await supabase
            .from('usuarios')
            .update(updateData)
            .eq('id', id)
            .select(`
                *,
                api_keys(*)
            `)
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
            .select(`
                tareas(*)
            `)
            .eq('usuario_id', usuarioId);

        if (error) throw error;
        return data.map(row => new Tarea(row.tareas));
    }
}

