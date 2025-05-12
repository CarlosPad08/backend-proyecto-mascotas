// En tu archivo de rutas
import express from 'express';
import { autenticarUsuario } from '../middlewares/auth.middleware.js';
import { cargarDatosUsuario } from '../middlewares/extraer_datos_usuario.middleware.js';
import { 
  crearSolicitud,
  obtenerSolicitudes,
  obtenerSolicitudPorId,
  actualizarSolicitud,
  actualizarEstadoSolicitud,
  eliminarSolicitud,
  obtenerSolicitudesPorUsuario,
} from '../controllers/solicitudes_adopcion.controller.js';

const router = express.Router();

// Ruta que requiere autenticación y datos completos del usuario
router.get('/saludo-dev', autenticarUsuario, cargarDatosUsuario, (req, res) => {
  // Aquí tienes acceso a req.usuario_id y req.usuario
  res.json({ 
    mensaje: `Hola ${req.usuario.nombre}`,
    datos: req.usuario
  });
});

// Para una acción que requiere registrar quién la creó
router.post('/crear-mascota', autenticarUsuario, cargarDatosUsuario, (req, res) => {
  const nuevaMascota = {
    ...req.body,
    creadorId: req.usuario_id,
    creadorNombre: req.usuario.nombre
  };
  
  // Lógica para guardar la mascota
});

// Rutas para solicitudes de adopción
router.post('/', autenticarUsuario, cargarDatosUsuario, crearSolicitud);
router.get('/', autenticarUsuario, cargarDatosUsuario, obtenerSolicitudes);
router.get('/refugio/:id', autenticarUsuario, cargarDatosUsuario, obtenerSolicitudesPorUsuario);
router.get('/:id', autenticarUsuario, cargarDatosUsuario, obtenerSolicitudPorId);
router.put('/:id', autenticarUsuario, cargarDatosUsuario, actualizarSolicitud);
router.patch('/:id/estado', autenticarUsuario, cargarDatosUsuario, actualizarEstadoSolicitud);
router.delete('/:id', autenticarUsuario, cargarDatosUsuario, eliminarSolicitud);

export default router;
