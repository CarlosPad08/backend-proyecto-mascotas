import express from "express";
import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  registrarUsuario
} from "../controllers/usuario.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/usuarios/registro:
 *   post:
 *     summary: Registro de usuario
 *     description: Permite registrar un nuevo usuario en la plataforma.
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rol_id:
 *                 type: integer
 *                 example: 1
 *               nombre:
 *                 type: string
 *                 example: "Juan"
 *               apellido:
 *                 type: string
 *                 example: "Pérez"
 *               email:
 *                 type: string
 *                 example: "juan@example.com"
 *               contrasena:
 *                 type: string
 *                 example: "securePassword123"
 *               telefono:
 *                 type: string
 *                 example: "3001234567"
 *               direccion:
 *                 type: string
 *                 example: "Calle 123, Ciudad"
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente.
 *       400:
 *         description: Error en el registro.
 */

router.get("/", obtenerUsuarios);
router.get("/:id", obtenerUsuarioPorId);
router.post("/", crearUsuario);
router.put("/:id", actualizarUsuario);
router.delete("/:id", eliminarUsuario);
router.post("/registrar", registrarUsuario);

export default router;
