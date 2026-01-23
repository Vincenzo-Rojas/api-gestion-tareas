import { supabase } from '../config/database.mjs';
import redis from '../config/redis.mjs';

/**
 * Middleware para validar API Keys y aplicar rate limiting
 */
export const apiKeyMiddleware = async (req, res, next) => {
  const apiKey = req.header('X-API-Key');

  if (!apiKey) {
    return res.status(401).json({ error: 'Falta API Key' });
  }

  // Buscar API Key activa y su usuario asociado
  const { data, error } = await supabase
    .from('api_keys')
    .select(`
      id,
      api_key,
      role,
      is_active,
      usuario_id,
      usuarios (
        id,
        nombre,
        email
      )
    `)
    .eq('api_key', apiKey)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return res.status(403).json({ error: 'API Key inválida' });
  }

  // Rate limiting con Redis (ventana de 1 minuto)
  const window = Math.floor(Date.now() / 60000);
  const redisKey = `rate:${apiKey}:${window}`;

  try {
    const count = await redis.incr(redisKey);

    if (count === 1) {
      await redis.expire(redisKey, 60);
    }

    if (count > 10) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }
  } catch (redisError) {
    console.error('Redis error:', redisError);
    // Continuar sin rate limiting si Redis falla
  }

  // Información normalizada disponible en toda la app
  req.client = {
    apiKey: data.api_key,
    role: data.role,
    usuarioId: data.usuario_id,
    usuario: data.usuarios
  };

  next();
};
