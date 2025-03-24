import { turso } from "../config/database.js";

export class Rol {
  //crear los roles de la BD
  static async crear(nombre) {
    const query = "INSERT INTO roles (nombre) VALUES (?);";
    await turso.execute({ sql: query, args: [nombre] });
    return { mensaje: "Rol creado correctamente" };
  }

  //obtener todos los roles
  static async obtenerTodos() {
    const query = "SELECT * FROM roles;";
    const { rows } = await turso.execute(query);
    return rows;
  }

  //obtener un rol por id
  static async obtenerPorId(id) {
    const query = "SELECT * FROM roles WHERE rol_id = ?;";
    const { rows } = await turso.execute({ sql: query, args: [id] });
    return rows[0] || null;
  }

  //actualizar un rol
  static async update(id, datos) {
    const query = "UPDATE roles SET nombre = ? WHERE rol_id = ?;";
    await turso.execute({ sql: query, args: [datos.nombre, id] });
    return { mensaje: "Rol actualizado correctamente" };
  }

  //eliminar un rol
  static async delete(id) {
    const query = "DELETE FROM roles WHERE rol_id = ?;";
    await turso.execute({ sql: query, args: [id] });
    return { mensaje: "Rol eliminado correctamente" };
  }
};