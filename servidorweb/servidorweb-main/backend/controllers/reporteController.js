const { body, param, validationResult } = require("express-validator");
const Comentario = require('../models/comentario');
const Usuario = require('../models/usuario');
const Reporte = require('../models/reporte');

module.exports = {
    async createReporte(req, res) {
        try {
            // Validar y sanitizar la entrada
            await Promise.all([
                body("idComentario").isInt().withMessage("ID de comentario inválido").run(req),
                body("idUsuario").isInt().withMessage("ID de usuario inválido").run(req),
                body("motivo").trim().escape().notEmpty().run(req),
            ]);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { idComentario, idUsuario, motivo } = req.body;

            // Crear reporte de forma segura
            const reporteDB = await Reporte.create({ idComentario, idUsuario, motivo });

            res.json(reporteDB);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error en el servidor" });
        }
    },

    async deleteReporte(req, res) {
        try {
            // Validar el ID del reporte (debe ser numérico)
            await param("id").isInt().run(req);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;

            // Consulta segura con Sequelize
            const reporte = await Reporte.findByPk(id);
            if (!reporte) {
                return res.status(404).json({
                    message: "Reporte no encontrado",
                });
            }

            await reporte.destroy();
            res.json({
                message: "Reporte eliminado",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error en el servidor" });
        }
    },

    // Obtener todos los reportes con datos relacionados
    async getAllReportes(req, res) {
        try {
            const reportes = await Reporte.findAll({
                include: [
                    {
                        model: Usuario, // Usuario que reporta
                        attributes: ['nombre', 'imagenPerfil'],
                    },
                    {
                        model: Comentario, // Comentario reportado
                        include: [
                            {
                                model: Usuario, // Usuario del comentario reportado
                                attributes: ['nombre', 'imagenPerfil'],
                            },
                        ],
                    },
                ],
            });

            res.json(reportes);
        } catch (error) {
            console.error('Error al obtener los reportes:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }
}

