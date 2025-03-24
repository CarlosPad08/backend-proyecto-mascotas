import express from "express";
import {
  iniciarSesion,
  cerrarSesion,
} from "../controllers/usuario.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Permite a un usuario iniciar sesión y recibir un token JWT.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@example.com"
 *               contrasena:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       400:
 *         description: Correo o contraseña incorrectos
 *       500:
 *         description: Error interno del servidor
 */

router.post("/login", iniciarSesion);
router.post("/logout", cerrarSesion);

export default router;
