import { turso } from "../config/database.js";
import bcrypt from "bcrypt";

export class Usuario {
  // Formatea un usuario para que no haya nulls
  static formatearUsuario(user) {
    return {
      usuario_id: user.usuario_id,
      rol_id: user.rol_id,
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      email: user.email || '',
      contrasena: user.contrasena || '',
      telefono: user.telefono || '',
      direccion: user.direccion || '',
      imagen: user.imagen || null
    };
  }

  static async obtenerPorEmail(email) {
    const query = `SELECT usuario_id, rol_id, nombre, apellido, email, contrasena, telefono, direccion, imagen FROM usuarios WHERE email = ?;`;
    const { rows } = await turso.execute({ sql: query, args: [email.toLowerCase().trim()] });
    return rows[0] ? this.formatearUsuario(rows[0]) : null;
  }

  static async obtenerPorId(id) {
    const query = `SELECT usuario_id, rol_id, nombre, apellido, email, contrasena, telefono, direccion, imagen FROM usuarios WHERE usuario_id = ?;`;
    const { rows } = await turso.execute({ sql: query, args: [id] });
    return rows[0] ? this.formatearUsuario(rows[0]) : null;
  }

  static async obtenerTodos() {
    const query = `SELECT usuario_id, rol_id, nombre, apellido, email, contrasena, telefono, direccion, imagen FROM usuarios;`;
    const { rows } = await turso.execute(query);
    return rows.map(this.formatearUsuario);
  }

  static async registrar({ rol_id, nombre, apellido, email, contrasena, telefono, direccion, imagen }) {
    const usuarioExistente = await this.obtenerPorEmail(email);
    if (usuarioExistente) {
      throw new Error("El email ya está registrado.");
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const query = `
      INSERT INTO usuarios (rol_id, nombre, apellido, email, contrasena, telefono, direccion, imagen)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    await turso.execute({
      sql: query,
      args: [
        rol_id,
        nombre,
        apellido,
        email.toLowerCase().trim(),
        hashedPassword,
        telefono || '',
        direccion || '',
        imagen || null
      ]
    });

    return { mensaje: "Usuario registrado correctamente" };
  }

  static async actualizar(id, datos) {
    // Primero obtenemos el usuario actual
    const usuarioActual = await this.obtenerPorId(id);
    if (!usuarioActual) {
      throw new Error("Usuario no encontrado");
    }

    // Mezclamos los datos actuales con los nuevos datos
    const datosActualizados = {
      rol_id: datos.rol_id !== undefined ? datos.rol_id : usuarioActual.rol_id,
      nombre: datos.nombre !== undefined ? datos.nombre : usuarioActual.nombre,
      apellido: datos.apellido !== undefined ? datos.apellido : usuarioActual.apellido,
      email: datos.email !== undefined ? datos.email.toLowerCase().trim() : usuarioActual.email,
      telefono: datos.telefono !== undefined ? datos.telefono : usuarioActual.telefono,
      direccion: datos.direccion !== undefined ? datos.direccion : usuarioActual.direccion,
      imagen: datos.imagen !== undefined ? datos.imagen : usuarioActual.imagen
    };

    const query = `
      UPDATE usuarios
      SET rol_id = ?, nombre = ?, apellido = ?, email = ?, telefono = ?, direccion = ?, imagen = ?
      WHERE usuario_id = ?;
    `;
    await turso.execute({
      sql: query,
      args: [
        datosActualizados.rol_id,
        datosActualizados.nombre,
        datosActualizados.apellido,
        datosActualizados.email,
        datosActualizados.telefono || '',
        datosActualizados.direccion || '',
        datosActualizados.imagen || null,
        id
      ]
    });

    return { mensaje: "Usuario actualizado correctamente" };
  }

  static async eliminar(id) {
    const query = "DELETE FROM usuarios WHERE usuario_id = ?;";
    await turso.execute({ sql: query, args: [id] });
    return { mensaje: "Usuario eliminado correctamente" };
  }
}
