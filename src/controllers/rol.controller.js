import { Rol } from "../models/rol.model.js";

export const obtenerRoles = async (req, res) => {
  try {
    const roles = await Rol.obtenerTodos();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener roles: ", error });
  }
};

export const obtenerRolPorId = async (req, res) => {
  try {
    const rol = await Rol.obtenerPorId(req.params.id);
    if (!rol) return res.status(404).json({ error: "Rol no encontrado"});
    res.json(rol);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener rol: ", error });
  }
};

export const crearRol = async (req, res) => {
  try {
    const resultado = await Rol.crear(req.body.nombre);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error al crear rol: ", error });
  }
};

export const actualizarRol = async (req, res) => {
  try {
    const resultado = await Rol.update(req.params.id, req.body);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar rol: ", error });
  }
};

export const eliminarRol = async (req, res) => {
  try {
    const resultado = await Rol.delete(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar rol: ", error });
  }
};