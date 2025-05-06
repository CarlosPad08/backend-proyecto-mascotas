import { turso } from "../config/database.js";

export class AnimalAdopcion {
  // Formatea un animal para que no haya nulls
  static formatearAnimal(animal) {
    return {
      animal_id: animal.animal_id,
      publicador_id: animal.publicador_id,
      tipo_publicador: animal.tipo_publicador,
      nombre: animal.nombre || '',
      especie: animal.especie || '',
      raza: animal.raza || '',
      edad: animal.edad || '',
      estado: animal.estado || '',
      descripcion: animal.descripcion || '',
      foto: animal.foto || '',
    };
  }

  static async obtenerPorId(id) {
    const query = `
      SELECT animal_id, publicador_id, tipo_publicador, nombre, especie, raza, edad, estado, descripcion, foto
      FROM animales_adopcion WHERE animal_id = ?;
    `;
    const { rows } = await turso.execute({ sql: query, args: [id] });
    return rows[0] ? this.formatearAnimal(rows[0]) : null;
  }

  static async obtenerPorRefugio(refugio_id) {
    const query = `
      SELECT animal_id, publicador_id, tipo_publicador, nombre, especie, raza, edad, estado, descripcion, foto
      FROM animales_adopcion
      WHERE publicador_id = ? AND tipo_publicador = 'refugio';
    `;
    const { rows } = await turso.execute({ sql: query, args: [refugio_id] });
    return rows.map(this.formatearAnimal);
  }

  static async obtenerTodos() {
    const query = `
      SELECT animal_id, publicador_id, tipo_publicador, nombre, especie, raza, edad, estado, descripcion, foto
      FROM animales_adopcion;
    `;
    const { rows } = await turso.execute(query);
    return rows.map(this.formatearAnimal);
  }

  static async registrar({ refugio_id, nombre, especie, raza, edad, estado, descripcion, foto }) {
    const query = `
      INSERT INTO animales_adopcion ( refugio_id, nombre, especie, raza, edad, estado, descripcion, foto)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    await turso.execute({
      sql: query,
      args: [
        refugio_id,
        nombre
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' '),
        especie,
        raza,
        edad,
        estado,
        descripcion || '',
        foto || ''
      ]
    });
  }

  static async actualizar(id, { publicador_id, tipo_publicador, nombre, especie, raza, edad, estado, descripcion, foto }) {
    const query = `
      UPDATE animales_adopcion
      SET publicador_id = ?, tipo_publicador = ?, nombre = ?, especie = ?, raza = ?, edad = ?, estado = ?, descripcion = ?, foto = ?
      WHERE animal_id = ?;
    `;
    await turso.execute({
      sql: query,
      args: [
        publicador_id,
        tipo_publicador,
        nombre
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' '),
        especie,
        raza,
        edad,
        estado,
        descripcion || '',
        foto || '',
        id
      ]
    });
  }

  static async eliminar(id) {
    const query = `DELETE FROM animales_adopcion WHERE animal_id = ?;`;
    await turso.execute({ sql: query, args: [id] });
  }
}
