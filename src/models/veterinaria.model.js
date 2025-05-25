import { turso } from "../config/database.js";
import bcrypt from "bcrypt";

export class Veterinaria {
  // Registrar una veterinaria
  static async registrar({ nombre, direccion, telefono, descripcion, email, contrasena }) {
    const existente = await this.obtenerPorEmail(email);

    if (existente) {
      throw new Error("El email ya está registrado.");
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const query = `
      INSERT INTO veterinarias (nombre, direccion, telefono, descripcion, email, contrasena)
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    await turso.execute({
      sql: query,
      args: [
        nombre,
        direccion,
        telefono,
        descripcion,
        email.toLowerCase().trim(),
        hashedPassword,
      ],
    });
  }

  // Obtener por email
  static async obtenerPorEmail(email) {
    const query = `SELECT * FROM veterinarias WHERE email = ?;`;
    const { rows } = await turso.execute({
      sql: query,
      args: [email.toLowerCase().trim()],
    });
    return rows[0];
  }

  // Obtener por ID
  static async obtenerPorId(id) {
    const query = `SELECT * FROM veterinarias WHERE veterinaria_id = ?;`;
    const { rows } = await turso.execute({
      sql: query,
      args: [id],
    });
    return rows[0];
  }

  // Obtener todas las veterinarias
  static async obtenerTodas() {
    const query = `SELECT * FROM veterinarias;`;
    const { rows } = await turso.execute(query);
    return rows;
  }

  // Actualizar veterinaria
  static async actualizar(id, { nombre, direccion, telefono, descripcion, email, contrasena }) {
    const existente = await this.obtenerPorId(id);
    if (!existente) {
      throw new Error("Veterinaria no encontrada.");
    }

    const hashedPassword = contrasena
      ? await bcrypt.hash(contrasena, 10)
      : existente.contrasena;

    const query = `
      UPDATE veterinarias
      SET nombre = ?, direccion = ?, telefono = ?, descripcion = ?, email = ?, contrasena = ?
      WHERE id = ?;
    `;

    await turso.execute({
      sql: query,
      args: [
        nombre,
        direccion,
        telefono,
        descripcion,
        email.toLowerCase().trim(),
        hashedPassword,
        id,
      ],
    });
  }

  // Eliminar veterinaria
  static async eliminar(id) {

    const existente = await this.obtenerPorId(id);
    if (!existente) {
      throw new Error("Veterinaria no encontrada.");
    }

    const query = `DELETE FROM veterinarias WHERE veterinaria_id = ?;`;

    await turso.execute({
      sql: query,
      args: [id],
    });
  }
}

