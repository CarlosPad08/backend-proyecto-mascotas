import { turso } from "../config/database.js";

export class Mascota {
    
  static async obtenerTodos() {
    const query = "SELECT * FROM mascotas;";
    const { rows } = await turso.execute(query);
    return rows;
  }

  static async obtenerMascotasPorUsuario(usuario_id) {
    try {
      const query = "SELECT * FROM mascotas WHERE dueno_id = ?";
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

  static async crear({ dueno_id, nombre, especie, raza, edad, foto, sexo, peso, vacunas, tamano }) {
    try {
      const query = `
      INSERT INTO mascotas (dueno_id, nombre, especie, raza, edad, foto, sexo,peso, vacunas, tamano)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
      await turso.execute({ sql: query, args: [dueno_id, nombre, especie, raza, edad, foto,sexo,peso, vacunas, tamano] });
      return { mensaje: "Mascota creada correctamente" };
    } catch (error) {
      throw new Error("Error al crear mascota: " + error.message);
    }
  }

  static async actualizar(id, datos) {
    // Primero obtenemos el usuario actual
    const mascotaActual = await this.obtenerPorId(id);
    if (!mascotaActual) {
      throw new Error("Mascota no encontrado");
    }

    const updatesPet = {
      dueno_id: datos.dueno_id !== undefined ? datos.dueno_id : mascotaActual.dueno_id,
      nombre: datos.nombre !== undefined ? datos.nombre : mascotaActual.nombre,
      especie: datos.especie !== undefined ? datos.especie : mascotaActual.especie,
      raza: datos.raza !== undefined ? datos.raza : mascotaActual.raza,
      edad: datos.edad !== undefined ? datos.edad : mascotaActual.edad,
      foto: datos.foto !== undefined ? datos.foto : mascotaActual.foto,
      sexo: datos.sexo !== undefined ? datos.sexo : mascotaActual.sexo,
      peso: datos.peso !== undefined ? datos.peso : mascotaActual.peso,
      vacunas: datos.vacunas !== undefined ? datos.vacunas : mascotaActual.vacunas,
      tamano: datos.tamano !== undefined ? datos.tamano : mascotaActual.tamano,
    };

    const query = `
    UPDATE mascotas SET dueno_id = ?, nombre = ?, especie = ?, raza = ?, edad = ?, foto = ?,sexo = ? ,peso = ? , vacunas = ?, tamano = ?
    WHERE mascota_id = ?;
    `;
    await turso.execute({ sql: query, args: [
      updatesPet.dueno_id, 
      updatesPet.nombre,
      updatesPet.especie,
      updatesPet.raza,
      updatesPet.edad,
      updatesPet.foto,
      updatesPet.sexo,
      updatesPet.peso,
      updatesPet.vacunas,
      updatesPet.tamano,
    id] });
    return { mensaje: "Mascota actualizada correctamente" };
  }

  static async eliminar(id) {
    const query = "DELETE FROM mascotas WHERE mascota_id = ?;";
    await turso.execute({ sql: query, args: [id] });
    return { mensaje: "Mascota eliminada correctamente" };
  }
};