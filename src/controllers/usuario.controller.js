import { Usuario } from "../models/usuario.model.js";
import { generarToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";

export const iniciarSesion = async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    const usuario = await Usuario.obtenerPorEmail(email);

    if (!usuario) {
      return res.status(400).json({ mensaje: "Correo o contraseña incorrectos" });
    }

    const esValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!esValida) {
      return res.status(400).json({ mensaje: "Correo o contraseña incorrectos" });
    }

    const token = generarToken(usuario);

    // Configurar cookie segura con el token
    res.cookie("token", token, {
      httpOnly: true, // Evita acceso desde JavaScript en el navegador (protección contra XSS)
      secure: process.env.NODE_ENV === "production", // Solo en HTTPS en producción
      sameSite: "Strict", // Protege contra ataques CSRF
      maxAge: 2 * 60 * 60 * 1000, // Expira en 2 horas
    });

    res.status(200).json({ mensaje: "Inicio de sesión exitoso", token });
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
