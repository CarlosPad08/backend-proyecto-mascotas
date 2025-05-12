import { SolicitudAdopcion } from '../models/solicitudes_adopcion.model.js';
import { Usuario } from '../models/usuario.model.js';
import { AnimalAdopcion } from '../models/animal_adopcion.model.js';

export const crearSolicitud = async (req, res) => {
    try {
        const usuario_id = req.usuario_id;
        const { mascota_id, mensaje } = req.body;

        // Primero, obtener datos del usuario desde la base de datos
        const usuario = await Usuario.obtenerPorId(usuario_id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Verificar si la mascota existe
        const mascota = await AnimalAdopcion.obtenerPorId(mascota_id);
        if (!mascota) {
            return res.status(404).json({ error: "Mascota no encontrada" });
        }

        // Formatear la fecha como string ISO
        const fechaActual = new Date().toISOString();
        // Dejar solo la fecha (quitar todo de la T hacia adelante)
        const fechaSinHora = fechaActual.split('T')[0];
        // Quitar los guiones
        const fechaSinGuiones = fechaSinHora.replace(/-/g, '');

        // Crear la solicitud de adopción
        const resultado = await SolicitudAdopcion.crearSolicitud({
            usuario_id,
            mascota_id,
            mensaje,
            estado: 'pendiente',
            fecha_solicitud: fechaSinGuiones,
            fecha_respuesta: null
        });

        res.status(201).json(resultado);
    } catch (error) {
        console.error("Error al crear solicitud:", error);
        res.status(500).json({ error: "Error al crear solicitud de adopción", mensaje: error.message });
    }
}

export const obtenerSolicitudes = async (req, res) => {
    try {
        const solicitudes = await SolicitudAdopcion.obtenerSolicitudes();
        res.json(solicitudes);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener solicitudes de adopción: ", error });
    }
}

export const obtenerSolicitudPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const solicitud = await SolicitudAdopcion.obtenerSolicitudPorId(id);
        if (!solicitud) return res.status(404).json({ error: "Solicitud no encontrada" });
        res.json(solicitud);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener solicitud de adopción: ", error });
    }
}

export const actualizarSolicitud = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await SolicitudAdopcion.actualizarSolicitud(id, req.body);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ error: "Error al actualizar solicitud de adopción: ", error });
    }
}

export const actualizarEstadoSolicitud = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const resultado = await SolicitudAdopcion.actualizarEstadoSolicitud(id, estado);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ error: "Error al actualizar estado de solicitud de adopción: ", error });
    }
}

export const eliminarSolicitud = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await SolicitudAdopcion.eliminarSolicitud(id);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ error: "Error al eliminar solicitud de adopción: ", error });
    }
}

export const obtenerSolicitudesPorUsuario = async (req, res) => {
    try {
        const { refugio_id } = req.params;
        const solicitudes = await SolicitudAdopcion.obtenerSolicitudesPorUsuario(refugio_id);
        res.json(solicitudes);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener solicitudes de adopción por usuario: ", error });
    }
}

export const obtenerSolicitudesPorMascota = async (req, res) => {
    try {
        const { mascota_id } = req.params;
        const solicitudes = await SolicitudAdopcion.obtenerSolicitudesPorMascota(mascota_id);
        res.json(solicitudes);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener solicitudes de adopción por mascota: ", error });
    }
}

export const obtenerSolicitudesPorEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        const solicitudes = await SolicitudAdopcion.obtenerSolicitudesPorEstado(estado);
        res.json(solicitudes);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener solicitudes de adopción por estado: ", error });
    }
}

