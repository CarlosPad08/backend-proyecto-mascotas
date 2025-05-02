import { Usuario } from '../models/usuario.model.js';

export const cargarDatosUsuario = async (req, res, next) => {
  try {
    // Verifica que el ID de usuario esté disponible
    if (!req.usuario_id) {
      return res.status(401).json({ mensaje: "Usuario no autenticado" });
    }
    
    const usuario = await Usuario.obtenerPorId(req.usuario_id);
    
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    
    // Elimina la contraseña para no exponerla
    if (usuario.contrasena) {
      delete usuario.contrasena;
    }
    
    // Añade el usuario completo a la solicitud
    req.usuario = usuario;
    next();
  } catch (error) {
    console.error('Error al cargar datos de usuario:', error);
    res.status(500).json({ mensaje: "Error al procesar la solicitud" });
  }
};