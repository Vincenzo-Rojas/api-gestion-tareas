import { ApiKeyService } from '../services/apiKeyService.mjs';

/**
 * Controlador para manejar las peticiones relacionadas con API Keys
 */
export class ApiKeyController {
  constructor() {
    this.service = new ApiKeyService();
  }

  /**
   * GET /api/admin/keys
   * Lista todas las API Keys registradas
   */
  getAllKeys = async (req, res) => {
    try {
      const keys = await this.service.getAllKeys();

      res.json({
        total: keys.length,
        keys: keys.map(k => k.toJSON()) // Solo campos de api_keys
      });
    } catch (error) {
      console.error('Error en getAllKeys:', error);
      res.status(500).json({ error: 'No se ha podido obtener las API Keys' });
    }
  };

  /**
   * PUT /api/admin/keys/:apiKey/deactivate
   * Desactiva una API Key
   */
  deactivateKey = async (req, res) => {
    try {
      const { apiKey } = req.params;

      const updatedKey = await this.service.deactivateKey(apiKey);

      res.json({
        message: 'API Key desactivada exitosamente',
        key: updatedKey.toJSON()
      });
    } catch (error) {
      console.error('Error en deactivateKey:', error);
      const status = error.message === 'API Key no encontrada' ? 404 : 500;
      res.status(status).json({ error: error.message });
    }
  };

  /**
   * PUT /api/admin/keys/:apiKey/activate
   * Activa una API Key
   */
  activateKey = async (req, res) => {
    try {
      const { apiKey } = req.params;

      const updatedKey = await this.service.activateKey(apiKey);

      res.json({
        message: 'API Key activada exitosamente',
        key: updatedKey.toJSON()
      });
    } catch (error) {
      console.error('Error en activateKey:', error);
      const status = error.message === 'API Key no encontrada' ? 404 : 500;
      res.status(status).json({ error: error.message });
    }
  };

  /**
   * GET /api/protected/me
   * Obtiene información del cliente autenticado
   */
  getMe = async (req, res) => {
    try {
      // El middleware ya validó y agregó req.client
      const client = req.client;

      // Solo devolver campos de la tabla api_keys
      res.json({
        id: client.id,
        usuario_id: client.usuario_id,
        api_key: client.api_key,
        role: client.role,
        is_active: client.is_active,
        created_at: client.created_at,
        updated_at: client.updated_at
      });
    } catch (error) {
      console.error('Error en getMe:', error);
      res.status(500).json({ error: 'Error al obtener información' });
    }
  };

  /**
   * GET /api/protected/data
   * Endpoint de ejemplo para datos protegidos
   */
  getProtectedData = async (req, res) => {
    try {
      const client = req.client;

      res.json({
        message: 'Acceso autorizado',
        api_key: client.api_key, // solo la API Key del usuario
        data: {
          ejemplo: 'Estos son tus datos protegidos',
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error en getProtectedData:', error);
      res.status(500).json({ error: 'Error al obtener datos' });
    }
  };
}
