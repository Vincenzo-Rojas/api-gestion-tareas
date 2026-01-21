import express from 'express';
import routes from './routes/index.mjs';

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARES GLOBALES
// ============================================

// Parsear JSON
app.use(express.json());

// Parsear URL-encoded
app.use(express.urlencoded({ extended: true }));

// CORS (opcional - descomentar si es necesario)
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-API-Key');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   next();
// });

// ============================================
// RUTAS
// ============================================

app.use('/api', routes);

// ============================================
// MANEJO DE ERRORES 404
// ============================================

app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path
  });
});

// ============================================
// MANEJO DE ERRORES GLOBALES
// ============================================

app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log(`\nServidor corriendo en http://localhost:${PORT}`);
  console.log(`\nEndpoints disponibles:`);
  console.log(`   POST http://localhost:${PORT}/api/register`);
  console.log(`   GET  http://localhost:${PORT}/api/protected/data`);
  console.log(`   GET  http://localhost:${PORT}/api/protected/me`);
  console.log(`   GET  http://localhost:${PORT}/api/admin/keys`);

  console.log(`\nPara registrar un nuevo cliente (CMD/PowerShell):`);
  console.log(`   curl -X POST http://localhost:${PORT}/api/register -H "Content-Type: application/json" -d "{\"client_name\":\"Mi App\",\"email\":\"app@example.com\"}"`);

  console.log(`\nPara consultar info del cliente (requiere API Key):`);
  console.log(`   curl -X GET http://localhost:${PORT}/api/protected/me -H "X-API-Key: tu-uuid-aqui"`);
});


export default app;
