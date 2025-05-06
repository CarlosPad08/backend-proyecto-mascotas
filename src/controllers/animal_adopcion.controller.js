import { AnimalAdopcion } from "../models/animal_adopcion.model.js";

export const obtenerAnimales = async (req, res) => {
  try {
    const animales = await AnimalAdopcion.obtenerTodos();
    res.json(animales);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener animales: ", error });
  }
}

export const obtenerAnimalesPorRefugio = async (req, res) => {
  try {
    const { refugio_id } = req.params;
    const animales = await AnimalAdopcion.obtenerPorRefugio(refugio_id);
    res.json(animales);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener animales por refugio: ", error });
  }
};

export const obtenerAnimalPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const animal = await AnimalAdopcion.obtenerPorId(id);
    if (!animal) return res.status(404).json({ error: "Animal no encontrado"});
    res.json(animal);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener animal: ", error });
  }
};

export const crearAnimal = async (req, res) => {
  try {

    
    let edad = parseInt(req.body.edad, 10);

    // Validación de edad
    if (isNaN(edad) || edad < 0 || edad > 30) {
      return res.status(400).json({ error: `Edad inválida. Debe ser un número entre 0 y 30. Valor recibido: ${req.body.edad}` });
    }

    // Sobrescribe edad con valor ya validado y parseado
    req.body.edad = edad;

    const resultado = await AnimalAdopcion.registrar(req.body);
    res.status(201).json({ message: "¡Animal creado exitosamente!", resultado });
  } catch (error) {
    console.error("Error al crear animal:", error);
    res.status(400).json({ error: "Error al crear animal", detalle: error.message });
  }
};


export const actualizarAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await AnimalAdopcion.actualizar(id, req.body);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar animal: ", error });
  }
};

export const eliminarAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await AnimalAdopcion.eliminar(id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: "Error al eliminar animal: ", error });
  }
};

export const buscarAnimales = async (req, res) => {
  try {
    const { nombre } = req.query;
    const animales = await AnimalAdopcion.buscarPorNombre(nombre);
    res.json(animales);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar animales: ", error });
  }
};