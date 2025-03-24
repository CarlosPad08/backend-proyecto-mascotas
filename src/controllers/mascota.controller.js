import { Mascota } from "../models/mascota.model.js";

export const obtenerMascotas = async (req, res) => {
  try {
    const mascotas = await Mascota.obtenerTodos();
    res.json(mascotas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener mascotas: ", error });
  }
};

export const obtenerMascotasUsuario = async (req, res) => {
  const usuario_id = req.usuario.usuario_id;

  try {
    const mascotas = await Mascota.obtenerMascotasPorUsuario(usuario_id);
    res.status(200).json(mascotas);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const obtenerMascotaPorId = async (req, res) => {
  try {
    const mascota = await Mascota.obtenerPorId(req.params.id);
    if (!mascota) return res.status(404).json({ error: "Mascota no encontrada"});
    res.json(mascota);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener mascota: ", error });
  }
};

export const crearMascota = async (req, res) => {
  try {
    const dueno_id = req.usuario_id;
    const { nombre, especie, raza, edad, foto } = req.body;

    if (!dueno_id || !nombre || !especie || !raza || !edad || !foto) {
      return res.status(400).json({ error: "Todos los campos obligatorios deben llenarse." });
    }

    const resultado = await Mascota.crear({ dueno_id, nombre, especie, raza, edad, foto });
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error al crear mascota: ", error });
  }
};

export const actualizarMascota = async (req, res) => {
  try {
    const resultado = await Mascota.actualizar(req.params.id, req.body);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar mascota: ", error });
  }
};

export const eliminarMascota = async (req, res) => {
  try {
    const resultado = await Mascota.eliminar(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar mascota: ", error });
  }
};