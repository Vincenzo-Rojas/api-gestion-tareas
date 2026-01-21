// Maneja endpoints de estadisticas con cache Redis integrado

import { EstadisticasRepository } from '../repositories/estadisticasRepository.mjs';
import redis from '../config/redis.mjs';

/**
 * Controlador para manejar peticiones de estadisticas
 * Implementa cache con Redis para optimizar consultas frecuentes
 */
export class EstadisticasController {
  constructor() {
    this.repository = new EstadisticasRepository();
    this.defaultTTL = {
      estadisticas: 600, // 10 minutos para estadísticas generales
      tareas: 300,      // 5 minutos para datos de tareas
      proyectos: 300    // 5 minutos para datos de proyectos
    };
  }

  /**
   * Métodos internos de cache
   */

  /**
   * Obtener un valor del cache por su clave
   * @param {string} key - Clave del cache
   * @returns {Object|null} - Datos parseados o null si no existe
   */
  async _getFromCache(key) {
    try {
      const cached = await redis.get(key);
      
      if (!cached) {
        console.log(`[CACHE MISS] No se encontro: ${key}`);
        return null;
      }

      console.log(`[CACHE HIT] Datos encontrados en cache: ${key}`);
      return JSON.parse(cached);
    } catch (error) {
      console.error('[CACHE ERROR] Error al obtener del cache:', error);
      return null;
    }
  }

  /**
   * Guardar un valor en el cache con tiempo de expiracion
   * @param {string} key - Clave del cache
   * @param {Object} data - Datos a guardar
   * @param {number} ttl - Tiempo de vida en segundos
   */
  async _saveToCache(key, data, ttl = 300) {
    try {
      await redis.setex(key, ttl, JSON.stringify(data));
      console.log(`[CACHE SET] Guardado en cache: ${key} (TTL: ${ttl}s)`);
    } catch (error) {
      console.error('[CACHE ERROR] Error al guardar en cache:', error);
    }
  }

  /**
   * Eliminar una clave especifica del cache
   * @param {string} key - Clave a eliminar
   */
  async _deleteFromCache(key) {
    try {
      await redis.del(key);
      console.log(`[CACHE DELETE] Eliminado del cache: ${key}`);
    } catch (error) {
      console.error('[CACHE ERROR] Error al eliminar del cache:', error);
    }
  }

  /**
   * Eliminar todas las claves que coincidan con un patron
   * @param {string} pattern - Patron de busqueda (ej: "estadisticas:*")
   */
  async _deleteCachePattern(pattern) {
    try {
      const keys = await redis.keys(pattern);
      
      if (keys.length > 0) {
        await redis.del(...keys);
        console.log(`[CACHE DELETE] Eliminadas ${keys.length} claves con patron: ${pattern}`);
      } else {
        console.log(`[CACHE DELETE] No se encontraron claves con patron: ${pattern}`);
      }
    } catch (error) {
      console.error('[CACHE ERROR] Error al eliminar patron del cache:', error);
    }
  }

  /**
   * Generar clave de cache estandarizada
   * @param {string} tipo - Tipo de dato
   * @param {...string} identificadores - Identificadores adicionales
   * @returns {string} - Clave de cache formateada
   */
  _generateCacheKey(tipo, ...identificadores) {
    return `${tipo}:${identificadores.join(':')}`;
  }

  /**
   * Verificar si una clave existe en el cache
   * @param {string} key - Clave a verificar
   * @returns {boolean} - true si existe, false si no
   */
  async _cacheExists(key) {
    try {
      const exists = await redis.exists(key);
      return exists === 1;
    } catch (error) {
      console.error('[CACHE ERROR] Error al verificar existencia:', error);
      return false;
    }
  }

  /**
   * Obtener tiempo de vida restante de una clave
   * @param {string} key - Clave a consultar
   * @returns {number} - Segundos restantes o -1 si no existe
   */
  async _getCacheTTL(key) {
    try {
      const ttl = await redis.ttl(key);
      return ttl;
    } catch (error) {
      console.error('[CACHE ERROR] Error al obtener TTL:', error);
      return -1;
    }
  }

  /**
   * Limpiar completamente el cache (usar con precaucion)
   */
  async _flushCache() {
    try {
      await redis.flushdb();
      console.log('[CACHE FLUSH] Cache completamente limpio');
    } catch (error) {
      console.error('[CACHE ERROR] Error al limpiar cache:', error);
    }
  }

  /**
   * Métodos del controlador (endpoints)
   */

  /**
   * GET /api/estadisticas/tareas-por-estado
   * Obtiene la cantidad de tareas agrupadas por estado
   * Cache: 5 minutos (300 segundos)
   */
  getTareasPorEstado = async (req, res) => {
    try {
      // Generar clave unica para este endpoint
      const cacheKey = this._generateCacheKey('estadisticas', 'tareas_por_estado');

      // Buscar en cache primero
      const cached = await this._getFromCache(cacheKey);
      if (cached) {
        return res.json({
          data: cached,
          message: 'Tareas agrupadas por estado (desde cache)',
          from_cache: true
        });
      }

      // Si no esta en cache, consultar base de datos
      const estadisticas = await this.repository.tareasPorEstado();

      // Guardar en cache con TTL de 5 minutos
      await this._saveToCache(cacheKey, estadisticas, this.defaultTTL.tareas);

      // Devolver respuesta
      res.json({
        data: estadisticas,
        message: 'Tareas agrupadas por estado',
        from_cache: false
      });
    } catch (error) {
      console.error('Error en getTareasPorEstado:', error);
      res.status(500).json({
        error: 'Error al obtener estadisticas de tareas',
        message: error.message
      });
    }
  };

  /**
   * GET /api/estadisticas/proyectos-top
   * Obtiene los proyectos con mas tareas
   * Query params: limite (default: 5)
   * Cache: 5 minutos (300 segundos)
   */
  getProyectosTop = async (req, res) => {
    try {
      // Obtener parametro limite de la query string (default: 5)
      const limite = parseInt(req.query.limite) || 5;

      // Validar que el limite sea razonable
      if (limite < 1 || limite > 50) {
        return res.status(400).json({
          error: 'Limite invalido',
          message: 'El limite debe estar entre 1 y 50'
        });
      }

      // Generar clave de cache incluyendo el limite
      const cacheKey = this._generateCacheKey('estadisticas', 'proyectos_top', limite.toString());

      // Buscar en cache
      const cached = await this._getFromCache(cacheKey);
      if (cached) {
        return res.json({
          data: cached,
          message: `Top ${limite} proyectos con mas tareas (desde cache)`,
          from_cache: true
        });
      }

      // Consultar base de datos
      const proyectos = await this.repository.proyectosConMasTareas(limite);

      // Guardar en cache
      await this._saveToCache(cacheKey, proyectos, this.defaultTTL.proyectos);

      // Devolver respuesta
      res.json({
        data: proyectos,
        message: `Top ${limite} proyectos con mas tareas`,
        from_cache: false
      });
    } catch (error) {
      console.error('Error en getProyectosTop:', error);
      res.status(500).json({
        error: 'Error al obtener proyectos top',
        message: error.message
      });
    }
  };

  /**
   * GET /api/estadisticas/generales
   * Obtiene estadisticas generales del sistema
   * Cache: 10 minutos (600 segundos)
   */
  getEstadisticasGenerales = async (req, res) => {
    try {
      const cacheKey = this._generateCacheKey('estadisticas', 'generales');

      // Buscar en cache
      const cached = await this._getFromCache(cacheKey);
      if (cached) {
        return res.json({
          data: cached,
          message: 'Estadisticas generales del sistema (desde cache)',
          from_cache: true
        });
      }

      // Consultar base de datos
      const estadisticas = await this.repository.estadisticasGenerales();

      // Guardar en cache con TTL de 10 minutos
      await this._saveToCache(cacheKey, estadisticas, this.defaultTTL.estadisticas);

      res.json({
        data: estadisticas,
        message: 'Estadisticas generales del sistema',
        from_cache: false
      });
    } catch (error) {
      console.error('Error en getEstadisticasGenerales:', error);
      res.status(500).json({
        error: 'Error al obtener estadisticas generales',
        message: error.message
      });
    }
  };

  /**
   * GET /api/estadisticas/proyecto/:id/tareas
   * Obtiene estadisticas de tareas de un proyecto especifico
   * Cache: 5 minutos (300 segundos)
   */
  getTareasDeProyecto = async (req, res) => {
    try {
      const proyectoId = parseInt(req.params.id);

      if (isNaN(proyectoId)) {
        return res.status(400).json({
          error: 'ID invalido',
          message: 'El ID del proyecto debe ser un numero'
        });
      }

      // Generar clave de cache con el ID del proyecto
      const cacheKey = this._generateCacheKey('estadisticas', 'proyecto', proyectoId.toString(), 'tareas');

      // Buscar en cache
      const cached = await this._getFromCache(cacheKey);
      if (cached) {
        return res.json({
          data: cached,
          message: `Tareas del proyecto ${proyectoId} por estado (desde cache)`,
          from_cache: true
        });
      }

      // Consultar base de datos
      const estadisticas = await this.repository.tareasDeProyectoPorEstado(proyectoId);

      // Guardar en cache
      await this._saveToCache(cacheKey, estadisticas, this.defaultTTL.tareas);

      res.json({
        data: estadisticas,
        message: `Tareas del proyecto ${proyectoId} por estado`,
        from_cache: false
      });
    } catch (error) {
      console.error('Error en getTareasDeProyecto:', error);
      res.status(500).json({
        error: 'Error al obtener tareas del proyecto',
        message: error.message
      });
    }
  };

  /**
   * Métodos de administración de cache
   */

  /**
   * DELETE /api/estadisticas/cache
   * Invalida todo el cache de estadisticas
   * Solo para administradores
   */
  invalidarCache = async (req, res) => {
    try {
      // Eliminar todas las claves que empiecen con "estadisticas:"
      await this._deleteCachePattern('estadisticas:*');

      res.json({
        message: 'Cache de estadisticas invalidado exitosamente'
      });
    } catch (error) {
      console.error('Error en invalidarCache:', error);
      res.status(500).json({
        error: 'Error al invalidar cache',
        message: error.message
      });
    }
  };

  /**
   * GET /api/estadisticas/cache/estado
   * Obtiene información del estado del cache
   */
  getEstadoCache = async (req, res) => {
    try {
      const keys = await redis.keys('estadisticas:*');
      const estadoCache = [];

      for (const key of keys) {
        const ttl = await this._getCacheTTL(key);
        const existe = await this._cacheExists(key);
        
        estadoCache.push({
          key,
          existe,
          ttl_segundos: ttl,
          ttl_minutos: Math.round(ttl / 60 * 10) / 10
        });
      }

      res.json({
        total_entradas: keys.length,
        entradas: estadoCache,
        default_ttl: this.defaultTTL
      });
    } catch (error) {
      console.error('Error en getEstadoCache:', error);
      res.status(500).json({
        error: 'Error al obtener estado del cache',
        message: error.message
      });
    }
  };

  /**
   * DELETE /api/estadisticas/cache/:key
   * Invalida una clave específica del cache
   */
  invalidarClaveCache = async (req, res) => {
    try {
      const { key } = req.params;
      
      if (!key || !key.startsWith('estadisticas:')) {
        return res.status(400).json({
          error: 'Clave invalida',
          message: 'La clave debe comenzar con "estadisticas:"'
        });
      }

      const existe = await this._cacheExists(key);
      
      if (!existe) {
        return res.status(404).json({
          error: 'Clave no encontrada',
          message: `La clave ${key} no existe en el cache`
        });
      }

      await this._deleteFromCache(key);

      res.json({
        message: `Clave ${key} eliminada del cache exitosamente`,
        clave: key
      });
    } catch (error) {
      console.error('Error en invalidarClaveCache:', error);
      res.status(500).json({
        error: 'Error al invalidar clave del cache',
        message: error.message
      });
    }
  };
}

// Exportar una instancia unica del controlador (Singleton)
export default new EstadisticasController();