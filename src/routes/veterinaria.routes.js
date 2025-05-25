import express from 'express';
import {
  iniciarSesionVeterinaria,
  registrarVeterinaria,
  obtenerVeterinariaPorEmail,
  obtenerVeterinarias,
  obtenerVeterinariaPorId,
  actualizarVeterinaria,
  eliminarVeterinaria
} from '../controllers/veterinaria.controller.js';

const router = express.Router();

router.post('/login-veterinaria', iniciarSesionVeterinaria);
router.post('/registro-veterinaria', registrarVeterinaria);
router.get('/', obtenerVeterinarias);
router.get('/id/:id', obtenerVeterinariaPorId);
router.get('/email/:email', obtenerVeterinariaPorEmail);
router.put('/:id', actualizarVeterinaria);
router.delete('/:id', eliminarVeterinaria);

export default router;
