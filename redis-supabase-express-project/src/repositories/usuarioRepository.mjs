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


    // Deshabilitamos a un usuario:
    async disable(id) {
        const { data, error } = await supabase
            .from('usuarios') // Tabla usuarios
            .update({ is_active: false }) // Updateamos y deshabilitamos al usuario.
            .eq('id', id) // Filtramos por ID.
            .select()
            .single();
        if (error) throw error;

        return data ? new Usuario(data) : null;
    }

    
    // Mostramos un usuario que pertenece a X proyecto:
    async findUsuariosByProyecto(proyectoId) {
        const { data, error } = await supabase
            .from('usuarios_proyectos') // Tabla que relaciona a los usuarios con los proyectos
            // Realizamos un JOIN con la tabla usuarios, asi obtenemos los datos completos, no solo la ID.
            .select(`usuarios:usuario_id (*)`)
            .eq('proyecto_id', proyectoId); // Filtramos por la ID del proyecto.

        if (error) throw error;
        // Devolvemos el array objetos.
        return data.map(item => new Usuario(item.usuarios));
    }
}