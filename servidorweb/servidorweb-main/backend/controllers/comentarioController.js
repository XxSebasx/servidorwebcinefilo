const { body, param, validationResult } = require("express-validator");
const { Sequelize } = require("sequelize");
const Comentario = require("../models/comentario");
const Usuario = require("../models/usuario");
const Pelicula = require("../models/pelicula");

// Función para calcular y actualizar la calificación de una película
async function calcularCalificacionPelicula(idPelicula) {
  try {
    // Obtener todas las valoraciones de los comentarios de la película
    const comentarios = await Comentario.findAll({
      where: { idPelicula },
      attributes: ["valoracion"],
    });

    // Contar la frecuencia de cada calificación
    const frecuencias = {};
    comentarios.forEach((comentario) => {
      const valoracion = comentario.valoracion;
      frecuencias[valoracion] = (frecuencias[valoracion] || 0) + 1;
    });

    // Determinar la calificación más popular
    let calificacionPopular = null;
    let maxFrecuencia = 0;

    Object.entries(frecuencias).forEach(([valoracion, frecuencia]) => {
      const valoracionNumerica = parseInt(valoracion, 10);
      if (
        frecuencia > maxFrecuencia ||
        (frecuencia === maxFrecuencia && valoracionNumerica < calificacionPopular)
      ) {
        maxFrecuencia = frecuencia;
        calificacionPopular = valoracionNumerica;
      }
    });

    // Actualizar la calificación de la película
    await Pelicula.update(
      { valoracion: calificacionPopular },
      { where: { ID: idPelicula } }
    );

    console.log(
      `Calificación actualizada para la película ${idPelicula}: ${calificacionPopular}`
    );
  } catch (error) {
    console.error("Error al calcular la calificación de la película:", error);
  }
}

module.exports = {
  // Obtener comentarios con validación
  async getComentarios(req, res) {
    try {
      // Validar el ID de la película (debe ser numérico)
      await param("id").isInt().run(req);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;

      // Consulta segura con Sequelize
      const comentarios = await Comentario.findAll({
        where: { idPelicula: id },
        include: [{ model: Usuario, attributes: ['nombre', 'imagenPerfil'] }],
      });

      res.json(comentarios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  },

  // Crear un comentario con validación de datos
  async createComentario(req, res) {
    try {
      // Validar y sanitizar la entrada
      await Promise.all([
        body("idPelicula").isInt().withMessage("ID de película inválido").run(req),
        body("idUsuario").isInt().withMessage("ID de usuario inválido").run(req),
        body("valoracion").isInt().withMessage("Valoración inválida").run(req),
        body("texto").trim().escape().notEmpty().withMessage("Texto es requerido").run(req),
      ]);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Extraer los datos del cuerpo de la solicitud
      const { idPelicula, idUsuario, texto, valoracion } = req.body;

      // Crear comentario de forma segura
      const comentarioDB = await Comentario.create({ idPelicula, idUsuario, texto, valoracion });

      // Calcular y actualizar la calificación de la película
      await calcularCalificacionPelicula(idPelicula);

      res.json(comentarioDB);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  },

  // Eliminar un comentario con validación
  async deleteComentario(req, res) {
    try {
      // Validar ID del comentario
      await param("id").isInt().withMessage("ID inválido").run(req);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;

      // Buscar comentario
      const comentario = await Comentario.findByPk(id);
      if (!comentario) {
        return res.status(404).json({ message: "Comentario no encontrado" });
      }

      // Eliminar comentario
      await comentario.destroy();
      res.json({ message: "Comentario eliminado" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  },
};