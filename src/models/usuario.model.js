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
      direccion: user.direccion || ''
    };
  }

  static async obtenerPorEmail(email) {
    const query = `SELECT usuario_id, rol_id, nombre, apellido, email, contrasena, telefono, direccion FROM usuarios WHERE email = ?;`;
    const { rows } = await turso.execute({ sql: query, args: [email.toLowerCase().trim()] });
    return rows[0] ? this.formatearUsuario(rows[0]) : null;
  }

  static async obtenerPorId(id) {
    const query = `SELECT usuario_id, rol_id, nombre, apellido, email, contrasena, telefono, direccion FROM usuarios WHERE usuario_id = ?;`;
    const { rows } = await turso.execute({ sql: query, args: [id] });
    return rows[0] ? this.formatearUsuario(rows[0]) : null;
  }

  static async obtenerTodos() {
    const query = `SELECT usuario_id, rol_id, nombre, apellido, email, contrasena, telefono, direccion FROM usuarios;`;
    const { rows } = await turso.execute(query);
    return rows.map(this.formatearUsuario);
  }

  static async registrar({ rol_id, nombre, apellido, email, contrasena, telefono, direccion }) {
    const usuarioExistente = await this.obtenerPorEmail(email);
    if (usuarioExistente) {
      throw new Error("El email ya está registrado.");
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const query = `
      INSERT INTO usuarios (rol_id, nombre, apellido, email, contrasena, telefono, direccion)
      VALUES (?, ?, ?, ?, ?, ?, ?);
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
        direccion || ''
      ]
    });

    return { mensaje: "Usuario registrado correctamente" };
  }

  static async actualizar(id, datos) {
    const query = `
      UPDATE usuarios
      SET rol_id = ?, nombre = ?, apellido = ?, email = ?, telefono = ?, direccion = ?
      WHERE usuario_id = ?;
    `;
    await turso.execute({
      sql: query,
      args: [
        datos.rol_id,
        datos.nombre,
        datos.apellido,
        datos.email.toLowerCase().trim(),
        datos.telefono || '',
        datos.direccion || '',
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
