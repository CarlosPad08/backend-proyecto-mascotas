import express from 'express';
import {
  IniciarSesion,
  registrarRefugio,
  obtenerRefugioPorEmail,
  obtenerRefugios,
  obtenerRefugioPorId,
  actualizarRefugio,
  eliminarRefugio
} from '../controllers/refugio.controller.js';

const router = express.Router();

router.post('/login-refugio', IniciarSesion);
router.post('/registro-refugio', registrarRefugio);
router.get('/', obtenerRefugios);
router.get('/:id', obtenerRefugioPorId);
router.get('/:email', obtenerRefugioPorEmail);
router.put('/:id', actualizarRefugio);
router.delete('/:id', eliminarRefugio);

export default router;