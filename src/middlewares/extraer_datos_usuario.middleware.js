import { Usuario } from '../models/usuario.model.js';

export const cargarDatosUsuario = async (req, res, next) => {
    try {
        // req.usuario_id debería estar disponible del middleware autenticarUsuario
        const usuario = await Usuario.obtenerPorId(req.usuario_id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        // Añadir el usuario completo al objeto request
        req.usuario = usuario;
        next();
    } catch (error) {
        res.status(500).json({ error: "Error al cargar datos del usuario" });
    }
};