const { body, param, validationResult } = require("express-validator");
const Pelicula = require('../models/pelicula');
const Comentario = require('../models/comentario');
const Usuario = require('../models/usuario');
const Enlace = require('../models/enlaces');
const sequelize = require('../config/database'); // Importa sequelize
const Sequelize = require('sequelize'); // Importa Sequelize

module.exports = {
    // Obtener todas las películas
    async getPeliculas(req, res) {
        try {
            const peliculas = await Pelicula.findAll();
            res.json(peliculas);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error en el servidor'
            });
        }
    },

    // Eliminar una película por ID con validación
    async deletePelicula(req, res) {
        try {
            await param("id").isInt().withMessage("ID inválido").run(req);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;
            const pelicula = await Pelicula.findByPk(id);
            if (!pelicula) {
                return res.status(404).json({
                    message: 'Pelicula no encontrada'
                });
            }
            await pelicula.destroy();
            res.json({
                message: 'Pelicula eliminada'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error en el servidor'
            });
        }
    },

    // Obtener una película por nombre, fecha, director y genero con validación
    async getPelicula(req, res) {
        try {
            await Promise.all([
                param("titulo").isString().withMessage("Titulo inválido").run(req),
                param("anio_estreno").isDate().withMessage("Año de estreno inválido").run(req),
                param("director").isString().withMessage("Director inválido").run(req),
                param("genero").isString().withMessage("Género inválido").run(req)
            ]);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { titulo, anio_estreno, director, genero } = req.params;
            const pelicula = await Pelicula.findOne({ where: { titulo, anio_estreno, director, genero } });
            if (!pelicula) {
                return res.status(404).json({
                    message: 'Pelicula no encontrada'
                });
            }
            res.json(pelicula);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error en el servidor'
            });
        }
    },

    // Obtener una película por ID con validación
    async getPeliculaById(req, res) {
        try {
            await param("id").isInt().withMessage("ID inválido").run(req);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;
            const pelicula = await Pelicula.findByPk(id);
            if (!pelicula) {
                return res.status(404).json({ message: 'Pelicula no encontrada' });
            }
            res.json(pelicula);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    },

    // Crear una nueva película con validación
    async createPelicula(req, res) {
        try {
            await Promise.all([
                body("titulo").trim().escape().notEmpty().withMessage("Titulo es requerido").run(req),
                body("anio_estreno").isDate().withMessage("Año de estreno inválido").run(req),
                body("descripcion").trim().escape().notEmpty().withMessage("Descripción es requerida").run(req),
                body("director").trim().escape().notEmpty().withMessage("Director es requerido").run(req),
                body("genero").trim().escape().notEmpty().withMessage("Género es requerido").run(req),
                body("duracion").trim().escape().notEmpty().withMessage("Duración es requerida").run(req),
                body("portada").trim().notEmpty().withMessage("Portada es requerida").run(req),
                body("trailer").run(req)
            ]);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const pelicula = await Pelicula.create(req.body);
            res.json(pelicula);
        } catch (error) {
            console.error('Error al crear la película:', error); // Log detallado
            res.status(500).json({ message: "Error en el servidor" });
        }
    },

    async updatePelicula(req, res) {
        try {
            await Promise.all([
                body("titulo").trim().escape().notEmpty().withMessage("Titulo es requerido").run(req),
                body("anio_estreno").isDate().withMessage("Año de estreno inválido").run(req),
                body("descripcion").trim().escape().notEmpty().withMessage("Descripción es requerida").run(req),
                body("director").trim().escape().notEmpty().withMessage("Director es requerido").run(req),
                body("genero").trim().escape().notEmpty().withMessage("Género es requerido").run(req),
                body("duracion").trim().escape().notEmpty().withMessage("Duración es requerida").run(req),
                body("portada").run(req),
                body("trailer").isURL().withMessage("URL de trailer inválida").run(req)
            ]);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;
            const pelicula = await Pelicula.findByPk(id);
            if (!pelicula) {
                return res.status(404).json({
                    message: 'Pelicula no encontrada'
                });
            }
            await pelicula.update(req.body);
            res.json(pelicula);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error en el servidor'
            });
        }
    },

    async rankingPeliculas(req, res) {
        try {
            const peliculas = await Pelicula.findAll({
                order: [['valoracion', 'DESC']],
            });
            res.json(peliculas);
        } catch (error) {
            console.error('Error al obtener las mejores películas:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    },

    // Obtener las películas más populares (ordenadas por número de comentarios)
    async getPeliculasPopulares(req, res) {
        try {
            const [results] = await sequelize.query(`
                SELECT p.*, COUNT(c.id) AS numComentarios
                FROM peliculas p
                LEFT JOIN comentarios c ON p.ID = c.idPelicula
                GROUP BY p.ID
                ORDER BY numComentarios DESC
            `);
            res.json(results);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    },

    // Buscar películas por título (case-insensitive)
    async buscarPeliculas(req, res) {
        try {
            const { query } = req.query; // Obtener las palabras clave de la consulta
            if (!query) {
                return res.status(400).json({ message: "El parámetro 'query' es requerido." });
            }

            const peliculas = await Pelicula.findAll({
                where: Sequelize.where(
                    Sequelize.fn("LOWER", Sequelize.col("titulo")),
                    "LIKE",
                    `%${query.toLowerCase()}%`
                )
            });

            res.json(peliculas);
        } catch (error) {
            console.error("Error al buscar películas:", error);
            res.status(500).json({ message: "Error en el servidor" });
        }
    },

    // Obtener las películas más recientes (ordenadas por fecha de estreno)
    async getPeliculasEstrenos(req, res) {
        try {
            const peliculas = await Pelicula.findAll({
                order: [['anio_estreno', 'DESC']],
            });
            res.json(peliculas);
        } catch (error) {
            console.error('Error al obtener las películas más recientes:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    },

    // Obtener películas por género
    async getPeliculasPorGenero(req, res) {
        try {
            const { genero } = req.query;

            if (!genero) {
                return res.status(400).json({ message: "El parámetro 'genero' es requerido." });
            }

            const peliculas = await Pelicula.findAll({
                where: { genero: genero.toLowerCase() },
            });

            res.json(peliculas);
        } catch (error) {
            console.error("Error al obtener películas por género:", error);
            res.status(500).json({ message: "Error en el servidor" });
        }
    },

    // Obtener películas por intervalo de años
    async getPeliculasPorAnio(req, res) {
        try {
            const { inicio, fin } = req.query;

            if (!inicio || !fin) {
                return res.status(400).json({ message: "Los parámetros 'inicio' y 'fin' son requeridos." });
            }

            const peliculas = await Pelicula.findAll({
                where: {
                    anio_estreno: {
                        [Sequelize.Op.between]: [new Date(`${inicio}-01-01`), new Date(`${fin}-12-31`)],
                    },
                },
            });

            res.json(peliculas);
        } catch (error) {
            console.error("Error al obtener películas por intervalo de años:", error);
            res.status(500).json({ message: "Error en el servidor" });
        }
    }
};