import { turso } from "../config/database.js";

export class SolicitudAdopcion {
// Crear una nueva solicitud de adopción
static async crearSolicitud(datos) {
    const query = "INSERT INTO solicitudes_adopcion (usuario_id, mascota_id, mensaje, estado, fecha_solicitud, fecha_respuesta) VALUES (?, ?, ?, ?, ?, ?);";
    
    try {
        await turso.execute({ sql: query, args: [
                datos.usuario_id,
                datos.mascota_id,
                datos.mensaje,
                datos.estado,
                datos.fecha_solicitud,
                datos.fecha_respuesta,
        ] });

        return { mensaje: "Solicitud de adopción creada correctamente" };
    } catch (error) {
        console.error("Error al crear la solicitud de adopción:", error);
        throw new Error("No se pudo crear la solicitud de adopción. Intente nuevamente.");
    }
}

  // Obtener todas las solicitudes de adopción
    static async obtenerSolicitudes() {
        const query = "SELECT * FROM solicitudes_adopcion;";
        const { rows } = await turso.execute(query);
        return rows;
    }

    // Obtener una solicitud de adopción por ID
    static async obtenerSolicitudPorId(id) {
        const query = "SELECT * FROM solicitudes_adopcion WHERE solicitud_id = ?;";
        const { rows } = await turso.execute({ sql: query, args: [id] });
        return rows[0] || null;
    }

    // Actualizar una solicitud de adopción
    static async actualizarSolicitud(id, datos) {
        const query = "UPDATE solicitudes_adopcion SET usuario_id = ?, mascota_id = ?, mensaje = ?, estado = ?, fecha_solicitud = ?, fecha_respuesta = ? WHERE solicitud_id = ?;";
        await turso.execute({ sql: query, args: [
            datos.usuario_id,
            datos.mascota_id,
            datos.mensaje,
            datos.estado,
            datos.fecha_solicitud,
            datos.fecha_respuesta,
            id
        ] });
        return { mensaje: "Solicitud de adopción actualizada correctamente" };
    }

    // Actualizar solo el estado de una solicitud de adopción
    static async actualizarEstadoSolicitud(id, estado) {
        const query = "UPDATE solicitudes_adopcion SET estado = ? WHERE solicitud_id = ?;";
        await turso.execute({ sql: query, args: [estado, id] });
        return { mensaje: "Estado de la solicitud de adopción actualizado correctamente" };
    }

    // Eliminar una solicitud de adopción
    static async eliminarSolicitud(id) {
        const query = "DELETE FROM solicitudes_adopcion WHERE solicitud_id = ?;";
        await turso.execute({ sql: query, args: [id] });
        return { mensaje: "Solicitud de adopción eliminada correctamente" };
    }

    // Obtener solicitudes de adopción por usuario
    static async obtenerSolicitudesPorUsuario(refugio_id) {
        console.log(refugio_id);
        const query = "SELECT s.id AS solicitud_id, s.usuario_id, u.nombre AS nombre_usuario, u.email AS email_usuario, s.mascota_id, a.nombre AS nombre_mascota, a.raza AS raza_mascota, s.mensaje, s.estado, s.fecha_solicitud, s.fecha_respuesta, r.refugio_id, r.nombre AS nombre_refugio FROM solicitudes_adopcion s JOIN animales_adopcion a ON s.mascota_id = a.animal_id JOIN refugios r ON a.refugio_id = r.refugio_id JOIN usuarios u ON s.usuario_id = u.usuario_id WHERE r.refugio_id = ?;";
        const { rows } = await turso.execute({ sql: query, args: [refugio_id] });
        return rows;
    }

    // Obtener solicitudes de adopción por mascota
    static async obtenerSolicitudesPorMascota(mascota_id) {
        const query = "SELECT * FROM solicitudes_adopcion WHERE mascota_id = ?;";
        const { rows } = await turso.execute({ sql: query, args: [mascota_id] });
        return rows;
    }

    // Obtener solicitudes de adopción por estado
    static async obtenerSolicitudesPorEstado(estado) {
        const query = "SELECT * FROM solicitudes_adopcion WHERE estado = ?;";
        const { rows } = await turso.execute({ sql: query, args: [estado] });
        return rows;
    }
};

export default SolicitudAdopcion;
