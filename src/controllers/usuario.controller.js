import { check } from "express-validator";
import { Usuario } from "../models/usuario.model.js";
import { generarToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

export const iniciarSesion = async (req, res) => {
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    return res.status(400).json({ mensaje: "Correo y contraseña son obligatorios" });
  }

  try {
    const usuario = await Usuario.obtenerPorEmail(email.toLowerCase());

    if (!usuario) {
      return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
    }

    const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
   
    if (!esValida) {
      return res.status(400).json({ mensaje: "Correo o contraseña incorrectos" });
    }

    const token = generarToken(usuario);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 12 * 60 * 60 * 1000,
    });
    
    // Enviar respuesta con los datos del usuario (sin contraseña)
    const usuarioData = {
      usuario_id: usuario.usuario_id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rol_id: usuario.rol_id
    };
    
    // AÑADIR ESTA RESPUESTA
    return res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      usuario: usuarioData
    });
    
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor", error: error.message });
  }
};

export const cerrarSesion = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ mensaje: "Sesión cerrada correctamente" });
};

export const registrarUsuario = async (req, res) => {
  try {
    const { rol_id, nombre, apellido, email, contrasena, telefono, direccion } = req.body;
    if (!rol_id || !nombre || !apellido || !email || !contrasena) {
      return res.status(400).json({ error: "Todos los campos obligatorios deben llenarse." });
    }

    
    const resultado = await Usuario.registrar({ rol_id, nombre, apellido, email, contrasena, telefono, direccion });
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.obtenerTodos();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios: ", error });
  }
};

export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.obtenerPorId(req.params.id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado"});
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuario: ", error });
  }
};

export const crearUsuario = async (req, res) => {
  try {
    const resultado = await Usuario.crear(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error al crear usuario: ", error });
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const resultado = await Usuario.actualizar(req.params.id, req.body);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar usuario: ", error });
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    const resultado = await Usuario.eliminar(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar usuario: ", error });
  }
};



export const solicitarRestablecimiento = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ mensaje: "El email es obligatorio" });
}
const emailLowerCase = email.toLowerCase();
  try {
      const usuario = await Usuario.obtenerPorEmail(email);
      if (!usuario) {
          return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }
      
      const token = generarToken(usuario);
      res.cookie("resetToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
          maxAge: 15 * 60 * 1000, // 15 minutos
      });
      
      // Simular envío de correo con el token
      console.log(`Enlace para restablecer contraseña: http://localhost:3000/reset?token=${token}`);
      res.json({ mensaje: "Revisa tu correo para restablecer tu contraseña" });
  } catch (error) {
      res.status(500).json({ mensaje: "Error en el servidor", error: error.message });
  }
};

export const restablecerContrasena = async (req, res) => {
  const { nuevaContrasena } = req.body;
  const token = req.cookies.resetToken;
  try {
      const usuario_id = verificarToken(token);
      if (!usuario_id) {
          return res.status(400).json({ mensaje: "Token inválido o expirado" });
      }

      const hash = await bcrypt.hash(nuevaContrasena, 10);
      await Usuario.actualizar(usuario_id, { contrasena: hash });
      res.clearCookie("resetToken");
      res.json({ mensaje: "Contraseña restablecida exitosamente" });
  } catch (error) {
      res.status(500).json({ mensaje: "Error en el servidor", error: error.message });
  }
};

export const verifyToken = (req, res) => {
  try {
    // Si la solicitud llega hasta aquí, significa que el middleware de autenticación
    // ya verificó el token y lo consideró válido
    
    // Puedes enviar información básica del usuario si lo deseas
    return res.status(200).json({
      mensaje: "Token válido"
    });
  } catch (error) {
    console.error("Error en la verificación del token:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};