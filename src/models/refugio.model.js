import { turso } from "../config/database.js";
import bcrypt from "bcrypt";

export class Refugio {

    // Registrar un refugio
    static async registrar({ nombre, direccion, telefono, descripcion, email, contrasena }) {
        
        const refugioExistente = await this.obtenerPorEmail(email);
        console.log("Llega aca");

        if (refugioExistente) {
            throw new Error("El email ya está registrado.");
        }


        const hashedPassword = await bcrypt.hash(contrasena, 10);

        const query = `
            INSERT INTO refugios (nombre, direccion, telefono, descripcion, email, contrasena)
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

    // Obtener refugio por email
    static async obtenerPorEmail(email) {
        const query = `
            SELECT * FROM refugios WHERE email = ?;
        `;
        const { rows } = await turso.execute({
            sql: query,
            args: [email.toLowerCase().trim()]
        });
        return rows[0];
    }

    // Obtener refugio por ID
    static async obtenerPorId(id) {
        const query = `
            SELECT * FROM refugios WHERE id = ?;
        `;
        const { rows } = await turso.execute({
            sql: query,
            args: [id]
        });
        return rows[0];
    }

    // Obtener todos los refugios
    static async obtenerTodos() {
        const query = `
            SELECT * FROM refugios;
        `;
        const { rows } = await turso.execute(query);
        return rows;
    }

    // Actualizar refugio
    static async actualizar(id, { nombre, direccion, telefono, descripcion, email, contrasena }) {
        const refugioExistente = await this.obtenerPorId(id);
        if (!refugioExistente) {
            throw new Error("Refugio no encontrado.");
        }

        const hashedPassword = contrasena ? await bcrypt.hash(contrasena, 10) : refugioExistente.contrasena;

        const query = `
            UPDATE refugios
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

    // Eliminar refugio
    static async eliminar(id) {
        const refugioExistente = await this.obtenerPorId(id);
        if (!refugioExistente) {
            throw new Error("Refugio no encontrado.");
        }

        const query = `
            DELETE FROM refugios WHERE id = ?;
        `;
        await turso.execute({
            sql: query,
            args: [id]
        });
    }
}