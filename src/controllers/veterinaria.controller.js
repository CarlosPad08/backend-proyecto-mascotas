import { Veterinaria } from "../models/veterinaria.model.js";
import { generarToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";

export const iniciarSesionVeterinaria = async (req, res) => {
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    return res.status(400).json({ mensaje: "El email y la contraseña son obligatorios" });
  }

  try {
    const veterinaria = await Veterinaria.obtenerPorEmail(email.toLowerCase());

    if (!veterinaria) {
      return res.status(404).json({ mensaje: "Veterinaria no encontrada" });
    }

    const contrasenaValida = await bcrypt.compare(contrasena, veterinaria.contrasena);

    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    const token = generarToken(veterinaria);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 12 * 60 * 60 * 1000,
    });

    const veterinariaData = {
      id: veterinaria.veterinaria_id,
      nombre: veterinaria.nombre,
      direccion: veterinaria.direccion,
      telefono: veterinaria.telefono,
      descripcion: veterinaria.descripcion,
      email: veterinaria.email
    };

    return res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      veterinaria: veterinariaData
    });

  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión", detalle: error.message });
  }
};

export const registrarVeterinaria = async (req, res) => {
  const { nombre, direccion, telefono, descripcion, email, contrasena } = req.body;
  if (!nombre || !direccion || !telefono || !descripcion || !email || !contrasena) {
    return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
  }

  try {
    await Veterinaria.registrar({ nombre, direccion, telefono, descripcion, email, contrasena });
    res.status(201).json({ mensaje: "Veterinaria registrada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar veterinaria", detalle: error.message });
  }
};

export const obtenerVeterinarias = async (req, res) => {
  try {
    const veterinarias = await Veterinaria.obtenerTodas();
    res.json(veterinarias);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener veterinarias", detalle: error.message });
  }
};

export const obtenerVeterinariaPorEmail = async (req, res) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({ mensaje: "El email es obligatorio" });
  }

  try {
    const veterinaria = await Veterinaria.obtenerPorEmail(email);
    if (!veterinaria) return res.status(404).json({ error: "Veterinaria no encontrada" });
    res.json(veterinaria);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener veterinaria", detalle: error.message });
  }
};

export const obtenerVeterinariaPorId = async (req, res) => {
  try {
    const veterinaria = await Veterinaria.obtenerPorId(req.params.id);
    if (!veterinaria) return res.status(404).json({ error: "Veterinaria no encontrada" });
    res.json(veterinaria);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener veterinaria", detalle: error.message });
  }
};

export const actualizarVeterinaria = async (req, res) => {
  try {
    await Veterinaria.actualizar(req.params.id, req.body);
    res.json({ mensaje: "Veterinaria actualizada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar veterinaria", detalle: error.message });
  }
};

export const eliminarVeterinaria = async (req, res) => {
  try {
    await Veterinaria.eliminar(req.params.id)
    res.status(204).json({ mensaje: "Veterinaria eliminada exitosamente!" });
    
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar veterinaria", detalle: error.message });
  }
};
