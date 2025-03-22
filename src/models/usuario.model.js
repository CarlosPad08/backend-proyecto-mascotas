import { turso } from "../config/database.js";

export class Usuario {
  static async obtenerTodos() {
    const query = "SELECT * FROM usuarios;";
    const { rows } = await turso.execute(query);
    return rows;
  }

  static async obtenerPorId(id) {
    const query = "SELECT * FROM usuarios WHERE usuario_id = ?;";
    const { rows } = await turso.execute({ sql: query, args: [id] });
    return rows[0] || null;
  }

  static async crear({ rol_id, nombre, apellido, email, contrasena, telefono, direccion }) {
    const query = `
      INSERT INTO usuarios (rol_id, nombre, apellido, email, contrasena, telefono, direccion)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    await turso.execute({ sql: query, args: [rol_id, nombre, apellido, email.toLowerCase().trim(), contrasena, telefono, direccion] });
    return { mensaje: "Usuario creado correctamente" };
  }

  static async actualizar(id, datos) {
    const query = `
      UPDATE usuarios SET rol_id = ?, nombre = ?, apellido = ?, email = ?, telefono = ?, direccion = ?
      WHERE usuario_id = ?;
    `;
    await turso.execute({ sql: query, args: [datos.rol_id, datos.nombre, datos.apellido, datos.email.toLowerCase().trim(), datos.telefono, datos.direccion, id] });
    return { mensaje: "Usuario actualizado correctamente" };
  }

  static async eliminar(id) {
    const query = "DELETE FROM usuarios WHERE usuario_id = ?;";
    await turso.execute({ sql: query, args: [id] });
    return { mensaje: "Usuario eliminado correctamente" };
  }
}