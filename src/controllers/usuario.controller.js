import { Usuario } from "../models/usuario.model.js";

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.obtenerTodos();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.obtenerPorId(req.params.id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

export const crearUsuario = async (req, res) => {
  try {
    const resultado = await Usuario.crear(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const resultado = await Usuario.actualizar(req.params.id, req.body);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    const resultado = await Usuario.eliminar(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};
