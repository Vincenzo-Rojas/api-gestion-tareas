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

  // =========================
  // RUTAS PUBLICAS
  // =========================
  console.log(`\nPublicos:`);
  console.log(`   POST http://localhost:${PORT}/api/register`);
  console.log(`   curl -X POST http://localhost:${PORT}/api/register -H "Content-Type: application/json" -d "{\\"nombre\\":\\"Juan\\",\\"email\\":\\"juan@example.com\\"}"`);
  console.log(`   -> Crea un usuario normal y genera automaticamente su API Key`);

  // =========================
  // RUTAS PROTEGIDAS
  // =========================
  console.log(`\nProtegidos (requieren API Key):`);
  console.log(`   GET http://localhost:${PORT}/api/protected/data`);
  console.log(`   curl -X GET http://localhost:${PORT}/api/protected/data -H "X-API-Key: tu-api-key-aqui"`);
  console.log(`   GET http://localhost:${PORT}/api/protected/me`);
  console.log(`   curl -X GET http://localhost:${PORT}/api/protected/me -H "X-API-Key: tu-api-key-aqui"`);

  // =========================
  // PROYECTOS
  // =========================
  console.log(`\nProyectos:`);
  console.log(`   GET http://localhost:${PORT}/api/proyectos`);
  console.log(`   curl -X GET http://localhost:${PORT}/api/proyectos -H "X-API-Key: tu-api-key-aqui"`);
  console.log(`   GET http://localhost:${PORT}/api/proyectos/:id`);
  console.log(`   curl -X GET http://localhost:${PORT}/api/proyectos/1 -H "X-API-Key: tu-api-key-aqui"`);
  console.log(`   POST http://localhost:${PORT}/api/proyectos (admin)`);
  console.log(`   curl -X POST http://localhost:${PORT}/api/proyectos -H "X-API-Key: admin-api-key" -H "Content-Type: application/json" -d "{\\"nombre\\":\\"Nuevo Proyecto\\",\\"descripcion\\":\\"Descripcion\\"}"`);
  console.log(`   PUT http://localhost:${PORT}/api/proyectos/:id (admin)`);
  console.log(`   DELETE http://localhost:${PORT}/api/proyectos/:id (admin)`);

  // =========================
  // TAREAS
  // =========================
  console.log(`\nTareas:`);
  console.log(`   GET http://localhost:${PORT}/api/tareas`);
  console.log(`   curl -X GET http://localhost:${PORT}/api/tareas -H "X-API-Key: tu-api-key-aqui"`);
  console.log(`   GET http://localhost:${PORT}/api/tareas/:id`);
  console.log(`   GET http://localhost:${PORT}/api/tareas/proyecto/:proyectoId`);
  console.log(`   POST http://localhost:${PORT}/api/tareas (admin)`);
  console.log(`   PUT http://localhost:${PORT}/api/tareas/:id (admin)`);
  console.log(`   DELETE http://localhost:${PORT}/api/tareas/:id (admin)`);

  // =========================
  // USUARIOS
  // =========================
  console.log(`\nUsuarios:`);
  console.log(`   GET http://localhost:${PORT}/api/usuarios/:id`);
  console.log(`   GET http://localhost:${PORT}/api/usuarios/email/:email`);
  console.log(`   POST http://localhost:${PORT}/api/usuarios (admin)`);
  console.log(`   PUT http://localhost:${PORT}/api/usuarios/:id (admin)`);
  console.log(`   DELETE http://localhost:${PORT}/api/usuarios/:id (admin)`);

  // =========================
  // ESTADISTICAS
  // =========================
  console.log(`\nEstadisticas:`);
  console.log(`   GET http://localhost:${PORT}/api/estadisticas/tareas-por-estado`);
  console.log(`   curl -X GET http://localhost:${PORT}/api/estadisticas/tareas-por-estado -H "X-API-Key: tu-api-key-aqui"`);
  console.log(`   GET http://localhost:${PORT}/api/estadisticas/proyectos-top?limite=5`);
  console.log(`   GET http://localhost:${PORT}/api/estadisticas/generales`);
  console.log(`   GET http://localhost:${PORT}/api/estadisticas/proyecto/:id/tareas`);
  console.log(`   DELETE http://localhost:${PORT}/api/estadisticas/cache (admin)`);

  // =========================
  // ADMIN
  // =========================
  console.log(`\nAdmin:`);
  console.log(`   GET http://localhost:${PORT}/api/admin/keys`);
  console.log(`   PUT http://localhost:${PORT}/api/admin/keys/:apiKey/deactivate`);
  console.log(`   PUT http://localhost:${PORT}/api/admin/keys/:apiKey/activate`);

  console.log(`\nAutenticacion:`);
  console.log(`   Header requerido: X-API-Key`);
});


export default app;
