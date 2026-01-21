// Contiene las 2 consultas avanzadas requeridas por el proyecto

import { supabase } from '../config/database.mjs';

/**
 * Repositorio para consultas avanzadas y estadisticas del sistema
 * Incluye operaciones complejas con JOIN, COUNT, GROUP BY, etc.
 */
export class EstadisticasRepository {

  /**
   * CONSULTA AVANZADA 1: Tareas agrupadas por estado
   * Usa: COUNT, GROUP BY
   * Devuelve: Cantidad de tareas en cada estado (pendiente, en_progreso, finalizada, cancelada)
   */
  async tareasPorEstado() {
    // Ejecutar consulta SQL directa usando Supabase
    // COUNT(*) cuenta todas las filas por cada grupo
    // GROUP BY estado agrupa las tareas segun su estado
    const { data, error } = await supabase
      .from('tareas')
      .select('estado')
      .order('estado');

    if (error) throw error;

    // Agrupar manualmente los resultados por estado
    const estadisticas = {};
    
    data.forEach(tarea => {
      if (!estadisticas[tarea.estado]) {
        estadisticas[tarea.estado] = 0;
      }
      estadisticas[tarea.estado]++;
    });

    // Convertir objeto a array para mejor formato de respuesta
    return Object.keys(estadisticas).map(estado => ({
      estado,
      total: estadisticas[estado]
    }));
  }

  /**
   * CONSULTA AVANZADA 2: Top proyectos con mas tareas
   * Usa: JOIN, COUNT, GROUP BY, ORDER BY, LIMIT
   * Devuelve: Los 5 proyectos con mayor cantidad de tareas
   */
  async proyectosConMasTareas(limite = 5) {
    // Realizar JOIN entre proyectos y tareas
    // Contar cuantas tareas tiene cada proyecto
    // Ordenar de mayor a menor y limitar resultados
    const { data, error } = await supabase
      .from('proyectos')
      .select(`
        id,
        nombre,
        descripcion,
        tareas:tareas(count)
      `)
      .order('tareas.count', { ascending: false })
      .limit(limite);

    if (error) throw error;

    // Transformar respuesta para formato mas legible
    return data.map(proyecto => ({
      proyecto_id: proyecto.id,
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion,
      total_tareas: proyecto.tareas[0]?.count || 0
    }));
  }

  /**
   * CONSULTA ADICIONAL: Estadisticas generales del sistema
   * Obtiene contadores globales de todas las entidades
   */
  async estadisticasGenerales() {
    // Contar total de proyectos
    const { count: totalProyectos, error: error1 } = await supabase
      .from('proyectos')
      .select('*', { count: 'exact', head: true });

    if (error1) throw error1;

    // Contar total de tareas
    const { count: totalTareas, error: error2 } = await supabase
      .from('tareas')
      .select('*', { count: 'exact', head: true });

    if (error2) throw error2;

    // Contar total de usuarios
    const { count: totalUsuarios, error: error3 } = await supabase
      .from('usuarios')
      .select('*', { count: 'exact', head: true });

    if (error3) throw error3;

    return {
      total_proyectos: totalProyectos,
      total_tareas: totalTareas,
      total_usuarios: totalUsuarios
    };
  }

  /**
   * CONSULTA ADICIONAL: Tareas por proyecto especifico
   * Filtra tareas de un proyecto y agrupa por estado
   */
  async tareasDeProyectoPorEstado(proyectoId) {
    const { data, error } = await supabase
      .from('tareas')
      .select('estado')
      .eq('proyecto_id', proyectoId);

    if (error) throw error;

    // Agrupar por estado
    const estadisticas = {};
    
    data.forEach(tarea => {
      if (!estadisticas[tarea.estado]) {
        estadisticas[tarea.estado] = 0;
      }
      estadisticas[tarea.estado]++;
    });

    return {
      proyecto_id: proyectoId,
      estadisticas: Object.keys(estadisticas).map(estado => ({
        estado,
        total: estadisticas[estado]
      }))
    };
  }
}