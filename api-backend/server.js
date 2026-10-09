const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 5000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://mi-mongo:27017/tareasdb';

app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Logs
app.use((req, res, next) => {
  if (req.method !== 'OPTIONS') console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Modelo: define cómo luce una tarea en la base de datos
const Tarea = mongoose.model('Tarea', new mongoose.Schema({ texto: String }));

// [GET] Listar tareas
app.get('/api/tareas', async (req, res) => {
  const tareas = await Tarea.find();
  res.json(tareas);
});

// [POST] Crear tarea
app.post('/api/tareas', async (req, res) => {
  const nuevaTarea = await Tarea.create({ texto: req.body.texto });
  res.status(201).json(nuevaTarea);
});

// [DELETE] Vaciar todas (va ANTES de la ruta con :id)
app.delete('/api/tareas/limpiar', async (req, res) => {
  await Tarea.deleteMany({});
  res.json({ mensaje: "Lista de tareas vaciada correctamente" });
});

// [DELETE] Eliminar una por id
app.delete('/api/tareas/:id', async (req, res) => {
  try {
    await Tarea.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Tarea eliminada correctamente" });
  } catch (error) {
    res.status(400).json({ mensaje: "ID inválido" });
  }
});

// Conectar a Mongo (con reintentos) y luego encender la API
async function iniciar() {
  while (true) {
    try {
      await mongoose.connect(MONGO_URL, { serverSelectionTimeoutMS: 3000 });
      console.log('Conectado a MongoDB');
      break;
    } catch (e) {
      console.log('MongoDB aún no está listo, reintentando en 3s...');
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  app.listen(PORT, () => console.log(`API REST corriendo en el puerto ${PORT}`));
}
iniciar();