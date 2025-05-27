import { Guarderia } from "../models/guarderia.model.js";
import { generarToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";

export const IniciarSesionGuarderia = async (req, res) => {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
        return res.status(400).json({ mensaje: "El email y la contraseña son obligatorios" });
    }

    try {
        const guarderia = await Guarderia.obtenerPorEmail(email.toLowerCase());

        if (!guarderia) {
            return res.status(404).json({ mensaje: "Guardería no encontrada" });
        }

        const contrasenaValida = await bcrypt.compare(contrasena, guarderia.contrasena);
        
        if (!contrasenaValida) {
            return res.status(401).json({ mensaje: "Contraseña incorrecta" });
        }

        const token = generarToken(guarderia);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 12 * 60 * 60 * 1000,
        });

        // Enviar respuesta con los datos de la guardería (sin contraseña)
        const guarderiaData = {
            id: guarderia.id,
            nombre: guarderia.nombre,
            direccion: guarderia.direccion,
            telefono: guarderia.telefono,
            descripcion: guarderia.descripcion,
            email: guarderia.email
        };

        return res.status(200).json({
            mensaje: "Inicio de sesión exitoso",
            guarderia: guarderiaData
        });

    } catch (error) {
        res.status(500).json({ error: "Error al iniciar sesión", error });
    }
}

export const registrarGuarderia = async (req, res) => {
    const { nombre, direccion, telefono, descripcion, email, contrasena } = req.body;
    if (!nombre || !direccion || !telefono || !descripcion || !email || !contrasena) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    try {
        await Guarderia.registrar({ nombre, direccion, telefono, descripcion, email, contrasena });
        return res.status(201).json({ mensaje: "Guardería registrada exitosamente" });
    } catch (error) {
        if (error.message.includes("ya está registrado")) {
            return res.status(409).json({ mensaje: error.message });
        }
        return res.status(500).json({ error: "Error al registrar la guardería", error });
    }
}

export const obtenerGuarderias = async (req, res) => {
    try {
        const guarderias = await Guarderia.obtenerTodas();
        return res.status(200).json(guarderias);
    } catch (error) {
        return res.status(500).json({ error: "Error al obtener las guarderías", error });
    }
}

export const obtenerGuarderiaPorEmail = async (req, res) => {
    const { email } = req.params;
    if (!email) {
        return res.status(400).json({ mensaje: "El email es obligatorio" });
    }

    try {
        const guarderia = await Guarderia.obtenerPorEmail(email.toLowerCase());
        if (!guarderia) {
            return res.status(404).json({ mensaje: "Guardería no encontrada" });
        }
        return res.status(200).json(guarderia);
    } catch (error) {
        return res.status(500).json({ error: "Error al obtener la guardería", error });
    }
}

export const obtenerGuarderiaPorId = async (req, res) => {
    try {
        const guarderia = await Guarderia.obtenerPorId(req.params.id);
        if (!guarderia) {
            return res.status(404).json({ mensaje: "Guardería no encontrada" });
        }
        return res.status(200).json(guarderia);
    } catch (error) {
        return res.status(500).json({ error: "Error al obtener la guardería", error });
    }
}

export const actualizarGuarderia = async (req, res) => {
    try {
        const resultado = await Guarderia.actualizar(req.params.id, req.body);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Guardería no encontrada o no se realizaron cambios" });
        }
        return res.status(200).json({ mensaje: "Guardería actualizada exitosamente" });
    }
    catch (error) {
        return res.status(500).json({ error: "Error al actualizar la guardería", error });
    }
}

export const eliminarGuarderia = async (req, res) => {
    try {
        const resultado = await Guarderia.eliminar(req.params.id);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Guardería no encontrada" });
        }
        return res.status(204).json({ mensaje: "Guardería eliminada exitosamente" });
    } catch (error) {
        return res.status(500).json({ error: "Error al eliminar la guardería", error });
    }
}
