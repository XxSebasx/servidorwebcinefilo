const Mensaje = require('../models/mensaje'); // Asegúrate de que la ruta sea correcta

module.exports = {
    async createMensaje(req, res) {
        try {
            const { nombre, email, asunto, contenido } = req.body;

            // Validar los datos del mensaje
            if (!nombre || !email || !asunto || !contenido) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios' });
            }

            //guardar el mensaje en la base de datos
            const nuevoMensaje = await Mensaje.create({ nombre, email, asunto, contenido });
            res.status(201).json(nuevoMensaje);


        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    },

    async getMensajes(req, res) {
        try {
            const mensajes = await Mensaje.findAll();
            res.status(200).json(mensajes);
        } catch (error) {
            console.error('Error al obtener los mensajes:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    },
};