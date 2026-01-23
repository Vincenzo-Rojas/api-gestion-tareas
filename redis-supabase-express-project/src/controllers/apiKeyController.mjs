import { ApiKeyService } from '../services/apiKeyService.mjs';

export class ApiKeyController {
  constructor() {
    this.service = new ApiKeyService();
  }

  getAllKeys = async (req, res) => {
    try {
      const keys = await this.service.getAllKeys();
      res.json({
        total: keys.length,
        keys: keys.map(k => k.toJSON())
      });
    } catch (error) {
      console.error('Error en getAllKeys:', error);
      res.status(500).json({ error: 'No se ha podido obtener las API Keys' });
    }
  };

  deactivateKey = async (req, res) => {
    try {
      const updatedKey = await this.service.deactivateKey(req.params.apiKey);
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

  activateKey = async (req, res) => {
    try {
      const updatedKey = await this.service.activateKey(req.params.apiKey);
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

  getMe = async (req, res) => {
    try {
      const client = req.client; // Middleware agrega la api_key del usuario
      res.json(client.toJSON()); // Solo los campos de api_keys
    } catch (error) {
      console.error('Error en getMe:', error);
      res.status(500).json({ error: 'Error al obtener información' });
    }
  };

  getProtectedData = async (req, res) => {
    try {
      const client = req.client;
      res.json({
        message: 'Acceso autorizado',
        api_key: client.api_key,
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