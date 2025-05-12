import { Refugio } from "../models/refugio.model.js";
import { generarToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";

export const IniciarSesion = async (req, res) => {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
        return res.status(400).json({ mensaje: "El email y la contraseña son obligatorios" });
    }

    try {
        const refugio = await Refugio.obtenerPorEmail(email.toLowerCase());

        if (!refugio) {
            return res.status(404).json({ mensaje: "Refugio no encontrado" });
        }

        const contrasenaValida = await bcrypt.compare(contrasena, refugio.contrasena);
        
        if (!contrasenaValida) {
            return res.status(401).json({ mensaje: "Contraseña incorrecta" });
        }

        const token = generarToken(refugio);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 12 * 60 * 60 * 1000,
        });

        // Enviar respuesta con los datos del refugio (sin contraseña)
        const refugioData = {
            id: refugio.refugio_id,
            nombre: refugio.nombre,
            direccion: refugio.direccion,
            telefono: refugio.telefono,
            descripcion: refugio.descripcion,
            email: refugio.email
        };

        return res.status(200).json({
            mensaje: "Inicio de sesión exitoso",
            refugio: refugioData
        });

    } catch (error) {
        res.status(500).json({ error: "Error al iniciar sesión: ", error });
    }
}

export const registrarRefugio = async (req, res) => {
    const { nombre, direccion, telefono, descripcion, email, contrasena } = req.body;
    if (!nombre || !direccion || !telefono || !descripcion || !email || !contrasena) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    try {
        await Refugio.registrar({ nombre, direccion, telefono, descripcion, email, contrasena });
        res.status(201).json({ mensaje: "Refugio registrado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar refugio: ", error });
    }
};

export const obtenerRefugios = async (req, res) => {
    try {
        const refugios = await Refugio.obtenerTodos();
        res.json(refugios);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener refugios: ", error });
    }
};

export const obtenerRefugioPorEmail = async (req, res) => {
    const { email } = req.params;
    if (!email) {
        return res.status(400).json({ mensaje: "El email es obligatorio" });
    }

    try {
        const refugio = await Refugio.obtenerPorEmail(email);
        if (!refugio) return res.status(404).json({ error: "Refugio no encontrado" });
        res.json(refugio);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener refugio: ", error });
    }
}

export const obtenerRefugioPorId = async (req, res) => {
    try {
        const refugio = await Refugio.obtenerPorId(req.params.id);
        if (!refugio) return res.status(404).json({ error: "Refugio no encontrado" });
        res.json(refugio);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener refugio: ", error });
    }
};

export const actualizarRefugio = async (req, res) => {
    try {
        const resultado = await Refugio.actualizar(req.params.id, req.body);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar refugio: ", error });
    }
};

export const eliminarRefugio = async (req, res) => {
    try {
        await Refugio.eliminar(req.params.id);
        res.status(204).json({ mensaje: "Refugio eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar refugio: ", error });
    }
};
