import { turso } from "../config/database.js";

export class AnimalAdopcion {
  // Formatea un animal para que no haya nulls
  static formatearAnimal(animal) {
    return {
      animal_id: animal.animal_id,
      refugio_id: animal.refugio_id,
      nombre: animal.nombre || '',
      especie: animal.especie || '',
      raza: animal.raza || '',
      edad: animal.edad || '',
      estado: animal.estado || '',
      descripcion: animal.descripcion || '',
      foto: animal.foto || '',
      sexo: animal.sexo || '', 
      peso: animal.peso || '',
      tamano: animal.tamano || ''

      
    };
  }

  static async obtenerPorId(id) {
    const query = `SELECT animal_id, refugio_id, nombre, especie, raza, edad, estado, descripcion, foto,sexo, peso, tamano FROM animales_adopcion WHERE animal_id = ?;`;
    const { rows } = await turso.execute({ sql: query, args: [id] });
    return rows[0] ? this.formatearAnimal(rows[0]) : null;
  }

    static async obtenerPorRefugio(refugio_id) {
        const query = `SELECT animal_id, refugio_id, nombre, especie, raza, edad, estado, descripcion, foto,sexo, peso, tamano FROM animales_adopcion WHERE refugio_id = ?;`;
        const { rows } = await turso.execute({ sql: query, args: [refugio_id] });
        return rows.map(this.formatearAnimal);
    }

    static async obtenerTodos() {
        const query = `SELECT animal_id, refugio_id, nombre, especie, raza, edad, estado, descripcion, foto,sexo, peso, tamano FROM animales_adopcion;`;
        const { rows } = await turso.execute(query);
        return rows.map(this.formatearAnimal);
    }

   static async registrar({ refugio_id, nombre, especie, raza, edad, estado, descripcion, foto,sexo, peso,tamano }) {
        const query = `
            INSERT INTO animales_adopcion (refugio_id, nombre, especie, raza, edad, estado, descripcion, foto,sexo, peso, tamano)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?);
        `;
          //console.log("Valores recibidos:");
           /* console.log("refugio_id:", refugio_id, typeof refugio_id);
            console.log("nombre:", nombre, typeof nombre);
            console.log("especie:", especie, typeof especie);
            console.log("raza:", raza, typeof raza);
            console.log("edad:", edad, typeof edad);
            console.log("estado:", estado, typeof estado);
            console.log("descripcion:", descripcion, typeof descripcion);
            console.log("foto:", foto, typeof foto);
            console.log("sexo:", sexo, typeof sexo);
            console.log("peso:", peso, typeof peso);
            console.log("vacunas:", vacunas, typeof vacunas);
            console.log("tamano:", tamano, typeof tamano);*/

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
             edad ,
            estado,
            descripcion || '',
            foto || '',
            sexo || '',
            peso || '',
            tamano || '' 
        
            ]
        });
    }

    static async actualizar(id, datos) {
    // Obtener el registro actual
    const mascotaActual = await this.obtenerPorId(id);
    if (!mascotaActual) {
        throw new Error("Mascota no encontrada");
    }

    // Mezclar datos nuevos con los existentes
    const mascotaActualizada = {
        refugio_id: datos.refugio_id !== undefined ? datos.refugio_id : mascotaActual.refugio_id,
        nombre: datos.nombre !== undefined ? datos.nombre : mascotaActual.nombre,
        especie: datos.especie !== undefined ? datos.especie : mascotaActual.especie,
        raza: datos.raza !== undefined ? datos.raza : mascotaActual.raza,
        edad: datos.edad !== undefined ? datos.edad : mascotaActual.edad,
        estado: datos.estado !== undefined ? datos.estado : mascotaActual.estado,
        descripcion: datos.descripcion !== undefined ? datos.descripcion : mascotaActual.descripcion,
        foto: datos.foto !== undefined ? datos.foto : mascotaActual.foto,
        sexo: datos.sexo !== undefined ? datos.sexo : mascotaActual.sexo,
        peso: datos.peso !== undefined ? datos.peso : mascotaActual.peso,
        tamano: datos.tamano !== undefined ? datos.tamano : mascotaActual.tamano,
    };

    const query = `
        UPDATE animales_adopcion 
        SET refugio_id = ?, nombre = ?, especie = ?, raza = ?, edad = ?, estado = ?, descripcion = ?, foto = ?, sexo = ?, peso = ?, tamano = ?
        WHERE animal_id = ?;
    `;

    await turso.execute({
        sql: query,
        args: [
            mascotaActualizada.refugio_id,
            mascotaActualizada.nombre
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' '),
            mascotaActualizada.especie,
            mascotaActualizada.raza,
            mascotaActualizada.edad,
            mascotaActualizada.estado,
            mascotaActualizada.descripcion || '',
            mascotaActualizada.foto || '',
            mascotaActualizada.sexo || '',
            mascotaActualizada.peso || '',
            mascotaActualizada.tamano || '',
            id
        ]
    });

    return { mensaje: "Mascota actualizada correctamente" };
}

    static async eliminar(id) {
        const query = `DELETE FROM animales_adopcion WHERE animal_id = ?;`;
        await turso.execute({ sql: query, args: [id] });
    }
};