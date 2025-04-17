import express from "express";
import { autenticarUsuario } from "../middlewares/auth.middleware.js";
import {
  obtenerMascotas,
  obtenerMascotaPorId,
  obtenerMascotasUsuario,
  crearMascota,
  actualizarMascota,
  eliminarMascota
} from "../controllers/mascota.controller.js";

const router = express.Router();

router.get("/", obtenerMascotas);
router.get("/buscar/:id", obtenerMascotaPorId);
router.post("/", autenticarUsuario, crearMascota);
router.post("/actualizar/:id", autenticarUsuario, actualizarMascota);
router.delete("/:id", eliminarMascota);

// Ruta privada: obtener mascotas del usuario autenticado
router.get("/obtener", autenticarUsuario, obtenerMascotasUsuario);

export default router;