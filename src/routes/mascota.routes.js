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
router.get("/:id", obtenerMascotaPorId);
router.post("/", autenticarUsuario, crearMascota);
router.put("/:id", autenticarUsuario, actualizarMascota);
router.delete("/:id", eliminarMascota);

export default router;