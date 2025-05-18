import { verificarToken } from '../utils/jwt.js';

// Mapa para simular sesiones activas por usuario
const sesionesActivas = new Map();

const verificarSesionPeriodicamente = () => {
  setInterval(() => {
    console.log('⏳ Verificando sesiones activas...');

    sesionesActivas.forEach((valor, usuarioId) => {
      const sigueActivo = true; // Aquí podrías hacer un fetch o lógica real

      if (!sigueActivo) {
        console.log(`❌ Usuario ${usuarioId} ya no está activo. Borrando sesión.`);
        sesionesActivas.delete(usuarioId);
      } else {
        console.log(`✅ Usuario ${usuarioId} sigue activo.`);
      }
    });
  }, 5 * 60 * 1000); // Cada 5 minutos
};

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  const usuarioId = verificarToken(token);

  if (!usuarioId) {
    return res.status(401).json({ mensaje: 'Token inválido' });
  }

  // Guardamos la sesión como activa (si no existe ya)
  if (!sesionesActivas.has(usuarioId)) {
    sesionesActivas.set(usuarioId, { activoDesde: new Date() });
  }

  req.usuarioId = usuarioId;
  next();
};

// Inicia la verificación automática de sesiones
//verificarSesionPeriodicamente();

export default verifyToken;
