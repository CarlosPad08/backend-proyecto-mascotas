import express from 'express';
import {
  IniciarSesionGuarderia,
  registrarGuarderia,
  obtenerGuarderiaPorEmail,
  obtenerGuarderias,
  obtenerGuarderiaPorId,
  actualizarGuarderia,
  eliminarGuarderia
} from '../controllers/guarderia.controller.js';

const router = express.Router();

router.post('/login-guarderia', IniciarSesionGuarderia);
router.post('/registro-guarderia', registrarGuarderia);
router.get('/', obtenerGuarderias);
router.get('/:id', obtenerGuarderiaPorId);
router.get('/:email', obtenerGuarderiaPorEmail);
router.put('/:id', actualizarGuarderia);
router.delete('/:id', eliminarGuarderia);

export default router;
