const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

// CORS: permite que el navegador (localhost:8082) llame a esta API
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Logs: muestra cada petición en la consola de Docker
app.use((req, res, next) => {
  if (req.method !== 'OPTIONS') console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// "Base de datos" en memoria
let tareas = [
  { id: 1, texto: "Aprender conceptos básicos de Docker" },
  { id: 2, texto: "Desplegar mi primer arquitectura de Microservicios" }
];

// [GET] Listar tareas
app.get('/api/tareas', (req, res) => {
  res.json(tareas);
});

// [POST] Crear tarea
app.post('/api/tareas', (req, res) => {
  const nuevaTarea = { id: Date.now(), texto: req.body.texto };
  tareas.push(nuevaTarea);
  res.status(201).json(nuevaTarea);
});

// [DELETE] RETO: vaciar toda la lista (va ANTES de la ruta con :id)
app.delete('/api/tareas/limpiar', (req, res) => {
  tareas = [];
  res.json({ mensaje: "Lista de tareas vaciada correctamente" });
});

// [DELETE] Eliminar una tarea por id
app.delete('/api/tareas/:id', (req, res) => {
  const idEliminar = parseInt(req.params.id);
  tareas = tareas.filter(t => t.id !== idEliminar);
  res.json({ mensaje: "Tarea eliminada correctamente" });
});

app.listen(PORT, () => console.log(`API REST corriendo en el puerto ${PORT}`));