const express = require("express");
const router = express.Router();
const comentarioController = require("../controllers/comentarioController");
const enlaceController = require("../controllers/enlaceController");
const peliculaController = require("../controllers/peliculaController");
const usuarioController = require("../controllers/usuarioController");
const reporteController = require("../controllers/reporteController");
const contactoController = require("../controllers/mensajeController");


//Comentario
router.post("/comentario", comentarioController.createComentario);
router.get("/comentario/:id", comentarioController.getComentarios);
router.delete("/comentario/:id", comentarioController.deleteComentario);


//Pelicula
router.post("/pelicula", peliculaController.createPelicula);
router.get("/pelicula", peliculaController.getPeliculas);
router.delete("/pelicula/:id", peliculaController.deletePelicula);
/* router.get("/pelicula/:id", peliculaController.getPelicula); */
router.get('/pelicula/:id', peliculaController.getPeliculaById);
router.get('/peliculas/top', peliculaController.rankingPeliculas);
router.get('/peliculas/populares', peliculaController.getPeliculasPopulares);
router.get('/peliculas/buscar', peliculaController.buscarPeliculas);
// Obtener las películas más recientes
router.get('/peliculas/estrenos', peliculaController.getPeliculasEstrenos);
// Obtener películas por género
router.get('/peliculas/genero', peliculaController.getPeliculasPorGenero);
// Obtener películas por intervalo de años
router.get('/peliculas/anio', peliculaController.getPeliculasPorAnio);


//Enlace
router.post("/enlace", enlaceController.createEnlace);
router.delete("/enlace/:id", enlaceController.deleteEnlace);

// Obtener enlaces por ID de película
router.get("/enlaces/:peliculaID", enlaceController.getEnlacesByPelicula);

// Agregar la ruta para actualizar un enlace
router.put("/enlace/:id", enlaceController.updateEnlace);


//Usuario
router.post("/usuario", usuarioController.createUser);
router.get("/usuario", usuarioController.getUsuarios);
router.delete("/usuario/:id", usuarioController.deleteUsuario);
router.post("/login", usuarioController.loginUser);
router.get("/usuario/:nombre", usuarioController.getUsuario);
router.post('/logout', usuarioController.logoutUser);
router.get('/session', usuarioController.getSession);

// Verificar si un usuario existe por email
router.get("/usuario/email/:email", usuarioController.getUsuarioPorEmail);

// Cambiar rol
router.put("/usuario/:id/rol", usuarioController.cambiarRol);

// Activar/Desactivar cuenta
router.put("/usuario/:id/estado", usuarioController.cambiarEstado);

// Eliminar usuario
router.delete("/usuario/:id", usuarioController.eliminarUsuario);

// Actualizar un usuario por ID
router.put("/usuario/:id", usuarioController.updateUsuario);

// Enviar código
router.post('/enviar-codigo', usuarioController.enviarCodigo);


router.post("/reporte", reporteController.createReporte);
router.delete("/reporte/:id", reporteController.deleteReporte);
router.get('/reportes', reporteController.getAllReportes);


//Contactos
router.post('/contacto', contactoController.createMensaje);
router.get('/contacto/mensajes', contactoController.getMensajes);


//Reportes
module.exports = router;
