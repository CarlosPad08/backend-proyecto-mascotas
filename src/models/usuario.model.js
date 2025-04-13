import { turso } from "../config/database.js";
import bcrypt from "bcrypt";

export class Usuario {
  
  static async obtenerPorEmail(email) {
    const query = "SELECT * FROM usuarios WHERE email = ?;";
    const { rows } = await turso.execute({ sql: query, args: [email.toLowerCase().trim()] });
    return rows[0] || null;
  }

  static async registrar({ rol_id, nombre, apellido, email, contrasena, telefono, direccion }) {
    // Verificar si el email ya está registrado
    const usuarioExistente = await this.obtenerPorEmail(email);
    if (usuarioExistente) {
      throw new Error("El email ya está registrado.");
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

    const query = "INSERT INTO usuarios (rol_id, nombre, apellido, email, contrasena, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?, ?);";
    await turso.execute({ sql: query, args: [rol_id, nombre, apellido, email.toLowerCase().trim(), /* `hashedPassword`
    is
    a
    variable
    that
    stores
    the
    hashed
    version
    of
    the
    user's
    password.
    In
    the
    code
    snippet
    provided,
    the
    password
    is
    hashed
    using
    the
    bcrypt
    library
    before
    being
    stored
    in
    the
    database.
    Hashing
    the
    password
    adds
    a
    layer
    of
    security
    by
    converting
    the
    password
    into
    a
    fixed-length
    string
    of
    characters
    that
    cannot
    be
    easily
    reversed
    to
    obtain
    the
    original
    password.
    This
    helps
    protect
    user
    passwords
    in
    case
    of
    a
    data
    breach. */
    hashedPassword, telefono, direccion] });

    return { mensaje: "Usuario registrado correctamente" };
  }
  
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