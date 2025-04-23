import express from 'express';
import { 
    obtenerAnimalPorId,
    obtenerAnimalesPorRefugio,
    obtenerAnimales,
    crearAnimal,
    actualizarAnimal,
    eliminarAnimal,
    buscarAnimales,
} from '../controllers/animal_adopcion.controller.js';

const router = express.Router();

router.get("/", obtenerAnimales);
router.get("/:id", obtenerAnimalPorId);
router.get("/refugio/:refugio_id", obtenerAnimalesPorRefugio);
router.post("/", crearAnimal);
router.put("/:id", actualizarAnimal);
router.delete("/:id", eliminarAnimal);
router.get("/buscar", buscarAnimales);

export default router;