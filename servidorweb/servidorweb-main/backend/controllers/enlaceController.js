const { body, param, validationResult } = require("express-validator");
const Enlace = require("../models/enlaces");
const Pelicula = require("../models/pelicula");

module.exports = {
    async createEnlace(req, res) {
        try {
            await body("peliculaID").isInt().withMessage("ID inválido").run(req);
            await body("plataforma").isIn(["Amazon", "Netflix", "Disney", "HBO", "Movistar", "otro"]).run(req);
            await body("url").isURL().withMessage("URL inválida").run(req);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { peliculaID, plataforma, url } = req.body;
            const pelicula = await Pelicula.findByPk(peliculaID);
            if (!pelicula) {
                return res.status(404).json({ message: "Película no encontrada" });
            }

            const nuevoEnlace = await Enlace.create({ peliculaID, plataforma, url });
            res.status(201).json(nuevoEnlace);
        } catch (error) {
            console.error('Error al crear el enlace:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    },

    async deleteEnlace(req, res) {
        try {
            await param("id").isInt().withMessage("ID inválido").run(req);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;
            const enlace = await Enlace.findByPk(id);
            if (!enlace) {
                return res.status(404).json({
                    message: "Enlace no encontrado",
                });
            }

            await enlace.destroy();
            res.json({
                message: "Enlace eliminado",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error en el servidor",
            });
        }
    },

    async updateEnlace(req, res) {
        try {
            await param("id").isInt().withMessage("ID inválido").run(req);
            await body("url").isURL().withMessage("URL inválida").run(req);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;
            const { url } = req.body;

            const enlace = await Enlace.findByPk(id);
            if (!enlace) {
                return res.status(404).json({ message: "Enlace no encontrado" });
            }

            enlace.url = url;
            await enlace.save();

            res.json({ message: "Enlace actualizado correctamente", url });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error en el servidor" });
        }
    },

    // Obtener enlaces por ID de película
    async getEnlacesByPelicula(req, res) {
        try {
            await param("peliculaID").isInt().withMessage("ID de película inválido").run(req);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { peliculaID } = req.params;
            const enlaces = await Enlace.findAll({ where: { peliculaID } });

            if (!enlaces || enlaces.length === 0) {
                return res.status(404).json({ message: "No se encontraron enlaces para esta película" });
            }

            res.json(enlaces);
        } catch (error) {
            console.error("Error al obtener los enlaces:", error);
            res.status(500).json({ message: "Error en el servidor" });
        }
    }
};