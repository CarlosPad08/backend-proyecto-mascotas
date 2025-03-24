import { body, validationResult } from "express-validator";
import { verificarToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";

export const validarRegistro = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  body("email").isEmail().withMessage("Debe ser un email válido"),
  body("contrasena").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    next();
  }
];


export const extraerUsuarioId = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodificar el token
    req.usuario_id = decoded.usuario_id; // Agregar usuario_id al objeto req
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido: ", error });
  }
};

export const autenticarUsuario = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ mensaje: "Acceso denegado, token no proporcionado" });
  }

  const usuarioDecodificado = verificarToken(token);

  if (!usuarioDecodificado) {
    return res.status(403).json({ mensaje: "Token inválido o expirado" });
  }

  req.usuario_id = usuarioDecodificado;
  next();
};
