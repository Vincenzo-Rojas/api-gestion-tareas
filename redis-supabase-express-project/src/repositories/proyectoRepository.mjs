// Importamos la conexión a la base de datos (Supabase):
import { supabase } from '../config/database.mjs';
// Importos el modelo Proyecto:
import { Proyecto } from '../models/Proyecto.mjs';

// Exportamos el repositorio para todos los metodos CRUD:
export class ProyectoRepository {
  async findAll() {
    const { data, error } = await supabase
      .from('proyectos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(item => new Proyecto(item));
  }
// Obtener por ID:
  async findById(id) {
    const { data, error } = await supabase
      .from('proyectos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return new Proyecto(data);
  }
// Crear un nuevo proyecto:
  async create(proyectoData) {
    const { data, error } = await supabase
      .from('proyectos')
      .insert([proyectoData])
      .select()
      .single();

    if (error) throw error;
    return new Proyecto(data);
  }
 // Actualizar un proyecto por ID
  async update(id, updateData) {
    const { data, error } = await supabase
      .from('proyectos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return new Proyecto(data);
  }
// Eliminar un proyecto por ID
  async delete(id) {
    const { error } = await supabase
      .from('proyectos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}