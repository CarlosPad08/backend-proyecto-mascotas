import { turso } from "../config/database.js";
import bcrypt from "bcrypt";

export class Guarderia {

    // Registrar una guardería
    static async registrar({ nombre, direccion, telefono, descripcion, email, contrasena }) {
        
        const guarderiaExistente = await this.obtenerPorEmail(email);

        if (guarderiaExistente) {
            throw new Error("El email ya está registrado.");
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);

        const query = `
            INSERT INTO guarderias (nombre, direccion, telefono, descripcion, email, contrasena)
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
                hashedPassword
            ]
        });
    }

    // Obtener guardería por email
    static async obtenerPorEmail(email) {
        const query = `
            SELECT * FROM guarderias WHERE email = ?;
        `;
        const { rows } = await turso.execute({
            sql: query,
            args: [email.toLowerCase().trim()]
        });
        return rows[0];
    }

    // Obtener guardería por ID
    static async obtenerPorId(id) {
        const query = `
            SELECT * FROM guarderias WHERE id = ?;
        `;
        const { rows } = await turso.execute({
            sql: query,
            args: [id]
        });
        return rows[0];
    }

    // Obtener todas las guarderías
    static async obtenerTodas() {
        const query = `
            SELECT * FROM guarderias;
        `;
        const { rows } = await turso.execute({
            sql: query
        });
        return rows;
    }

    // Actualizar guardería
    static async actualizar(id, { nombre, direccion, telefono, descripcion, email, contrasena }) {
        const guarderiaExistente = await this.obtenerPorId(id);

        if (!guarderiaExistente) {
            throw new Error("Guardería no encontrada.");
        }

        const hashedPassword = contrasena ? await bcrypt.hash(contrasena, 10) : guarderiaExistente.contrasena;

        const query = `
            UPDATE guarderias
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
                id
            ]
        });
    }

    // Eliminar guardería
    static async eliminar(id) {
        const guarderiaExistente = await this.obtenerPorId(id);

        if (!guarderiaExistente) {
            throw new Error("Guardería no encontrada.");
        }

        const query = `
            DELETE FROM guarderias WHERE id = ?;
        `;
        await turso.execute({
            sql: query,
            args: [id]
        });
    }
}
