import { turso } from "../config/database.js";

export class Mascota {
    
  static async obtenerTodos() {
    const query = "SELECT * FROM mascotas;";
    const { rows } = await turso.execute(query);
    return rows;
  }

  static async obtenerMascotasPorUsuario(usuario_id) {
    try {
      const query = "SELECT * FROM mascotas WHERE usuario_id = ?";
      const resultado = await turso.execute({
        sql: query,
        args: [usuario_id],
      });

      return resultado.rows;
    } catch (error) {
      throw new Error("Error al obtener mascotas: " + error.message);
    }
  }

  static async obtenerPorId(id) {
    const query = "SELECT * FROM mascotas WHERE mascota_id = ?;";
    const { rows } = await turso.execute({ sql: query, args: [id] });
    return rows[0] || null;
  }

  static async crear({ dueno_id, nombre, especie, raza, edad, foto }) {
    try {
      const query = `
      INSERT INTO mascotas (dueno_id, nombre, especie, raza, edad, foto)
      VALUES (?, ?, ?, ?, ?, ?);
      `;
      await turso.execute({ sql: query, args: [dueno_id, nombre, especie, raza, edad, foto] });
      return { mensaje: "Mascota creada correctamente" };
    } catch (error) {
      throw new Error("Error al crear mascota: " + error.message);
    }
  }

  static async actualizar(id, datos) {
    const query = `
    UPDATE mascotas SET usuario_id = ?, nombre = ?, especie = ?, raza = ?, edad = ?, foto = ?
    WHERE mascota_id = ?;
    `;
    await turso.execute({ sql: query, args: [datos.usuario_id, datos.nombre, datos.especie, datos.raza, datos.edad, datos.foto, id] });
    return { mensaje: "Mascota actualizada correctamente" };
  }

  static async eliminar(id) {
    const query = "DELETE FROM mascotas WHERE mascota_id = ?;";
    await turso.execute({ sql: query, args: [id] });
    return { mensaje: "Mascota eliminada correctamente" };
  }
};