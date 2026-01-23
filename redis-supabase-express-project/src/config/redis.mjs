
import { createClient } from 'redis';

let redisClient = null;

try {
  console.log('🔄 Intentando conectar a Redis en redis://localhost:6379');
  
  redisClient = createClient({
    url: 'redis://localhost:6379'
  });

  // Conectar SIN eventos complejos
  await redisClient.connect();
  
  // Probar la conexión
  await redisClient.ping();
  console.log('✅ Redis conectado exitosamente');
  
} catch (error) {
  console.error('❌ NO se pudo conectar a Redis:', error.message);
  console.log('⚠️ Continuando SIN cache de Redis');
  
  // Crear un objeto mock MUY simple
  redisClient = {
    // Método get siempre retorna null (simula cache miss)
    get: async (key) => {
      console.log(`[MOCK CACHE] GET ${key} -> null`);
      return null;
    },
    
    // Método setEx no hace nada
    setEx: async (key, ttl, value) => {
      console.log(`[MOCK CACHE] SETEX ${key} (TTL: ${ttl}s) -> skipped`);
      return 'OK';
    },
    
    // Otros métodos mock básicos
    del: async () => 'OK',
    keys: async () => [],
    exists: async () => 0,
    ttl: async () => -2,
    flushdb: async () => 'OK'
  };
}

// Exportar como default
export default redisClient;