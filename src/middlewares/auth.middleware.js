import { body, validationResult } from "express-validator";

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