require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require('express-session');
const fs = require('fs');
const cors = require('cors');

const app = express();
const sequelize = require('./config/database');
require('./models/relacion');



const Pelicula = require('./models/pelicula'); // Importa el modelo Pelicula
const Usuario = require('./models/usuario'); // Asegúrate de importar el modelo
const Comentario = require('./models/comentario');
const Enlace = require('./models/enlaces');
const Mensaje = require('./models/mensaje');
const Reporte = require('./models/reporte');


app.use(cors({
    origin: ['http://localhost:4200', 'http://192.168.1.146:4200'],
    credentials: true
}));

app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(session({
    secret: 'mi_secreto_seguro',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

const carteleraRouter = require("./routers/carteleraRouter");
app.use("/", carteleraRouter);

const uploadRouter = require('./routers/uploadRouter');
app.use('/', uploadRouter);

sequelize.authenticate()
    .then(() => console.log('Conexión exitosa con la base de datos'))
    .catch((error) => console.error('Error conectando a la base de datos:', error));

sequelize.sync({ force: false })
    .then(async () => {
        console.log('Modelos sincronizados con la base de datos');

        const cantidadPeliculas = await Pelicula.count();
        if (cantidadPeliculas === 0) {
            const peliculas = [
                {
                    ID: 1,
                    titulo: 'jurassic park',
                    anio_estreno: new Date('1993-09-30'),
                    descripcion: 'El multimillonario John Hammond hace realidad su sueño de clonar dinosaurios del Jurásico y crear con ellos un parque temático en una isla...',
                    director: 'Steven Spielberg',
                    genero: 'ciencia ficcion',
                    duracion: '2h',
                    portada: 'http://172.20.0.10:3000/uploads/1746101861761-997615221.jpg',
                    trailer: 'https://www.youtube.com/embed/QWBKEmWWL38?si=L-TK9-liL7RfnVDJ',
                    valoracion: 5
                },
                {
                    ID: 2,
                    titulo: 'Viernes 13',
                    anio_estreno: new Date('1980-07-13'),
                    descripcion: 'El campamento de verano de Crystal Lake reabre sus puertas tras permanecer varios años cerrado a raíz de un accidente...',
                    director: 'Sean S. Cunningham',
                    genero: 'terror',
                    duracion: '1h 35m',
                    portada: 'http://172.20.0.10:3000/uploads/1746102155540-96086221.jpg',
                    trailer: 'https://www.youtube.com/watch?v=aDrOvFtzyPQ',
                    valoracion: 0
                },
                {
                    ID: 3,
                    titulo: 'The Terminator',
                    anio_estreno: new Date('1985-01-18'),
                    descripcion: 'En el año 2029 las máquinas dominan el mundo. Los rebeldes que luchan contra ellas tienen como líder a John Connor...',
                    director: 'James Cameron',
                    genero: 'ciencia ficcion',
                    duracion: '108 min',
                    portada: 'http://172.20.0.10:3000/uploads/1746726492239-382824393.jpg',
                    trailer: 'https://www.dailymotion.com/video/x95n2d0',
                    valoracion: 4
                },
                {
                    ID: 4,
                    titulo: 'Titanic',
                    anio_estreno: new Date('1997-12-19'),
                    descripcion: 'Una historia de amor florece a bordo del fatídico RMS Titanic.',
                    director: 'James Cameron',
                    genero: 'drama',
                    duracion: '3h 15m',
                    portada: 'http://172.20.0.10:3000/uploads/1747155134962-431174463.jpg',
                    trailer: 'https://www.youtube.com/embed/kVrqfYjkTdQ?si=2p779pDdQ792u_Kp',
                    valoracion: 0
                },
                {
                    ID: 5,
                    titulo: 'El Laberinto del Fauno',
                    anio_estreno: new Date('2006-10-11'),
                    descripcion: 'La lucha de una niña entre la fantasía y la dura realidad del franquismo.',
                    director: 'Guillermo del Toro',
                    genero: 'fantasia',
                    duracion: '1h 58m',
                    portada: 'http://172.20.0.10:3000/uploads/1747156306711-327068188.jpg',
                    trailer: 'https://www.youtube.com/embed/FGzvvUBXj5M?si=q5JT9TpM2uyrBS10',
                    valoracion: 0
                },
                {
                    ID: 6,
                    titulo: 'Spider-Man: No Way Home',
                    anio_estreno: new Date('2021-12-17'),
                    descripcion: 'El multiverso se desata cuando Peter Parker pide ayuda a Dr. Strange.',
                    director: 'Jon Watts',
                    genero: 'accion',
                    duracion: '2h 28m',
                    portada: 'http://172.20.0.10:3000/uploads/1747156669107-132813410.jpg',
                    trailer: 'https://www.youtube.com/embed/SkmRT3M4Vx4?si=2j5cyhiQtnyrimHc',
                    valoracion: 3
                }, {
                    ID: 7,
                    titulo: 'Halloween',
                    anio_estreno: new Date('1978-10-25'),
                    descripcion: 'El pequeño Michael Myers asesina a su hermana en la noche de Halloween de 1963, por lo que es internado en un psiquiátrico. Seis años más tarde, Myers se escapa del hospital y regresa a su pueblo natal, Haddonfield, en Illinois.',
                    director: 'John Carpenter',
                    genero: 'terror',
                    duracion: '1h 31m',
                    portada: 'http://172.20.0.10:3000/uploads/1747159065832-387619146.jpg',
                    trailer: 'https://www.youtube.com/embed/xOv7_K_nb8I?si=FIeVvVRJsamkD-nV',
                    valoracion: 2
                },
                {
                    ID: 8,
                    titulo: 'Scream',
                    anio_estreno: new Date('1996-12-20'),
                    descripcion: 'Un asesino enmascarado persigue a adolescentes.',
                    director: 'Wes Craven',
                    genero: 'terror',
                    duracion: '1h 51m',
                    portada: 'http://172.20.0.10:3000/uploads/1747159858132-998148053.jpg',
                    trailer: 'https://www.youtube.com/embed/i3J6ACKQ7K0?si=4f3LWqojmpbE2XBt',
                    valoracion: 1
                },
                {
                    ID: 9,
                    titulo: 'The Matrix',
                    anio_estreno: new Date('1999-03-31'),
                    descripcion: 'Un programador descubre que el mundo es una simulación.',
                    director: 'Wachowski Sisters',
                    genero: 'ciencia ficcion',
                    duracion: '2h 16m',
                    portada: 'http://172.20.0.10:3000/uploads/1747163815633-532198394.jpg',
                    trailer: 'https://www.youtube.com/embed/vKQi3bBA1y8?si=Dxbhb0pgFgBiaZr_',
                    valoracion: 0
                },
                {
                    ID: 10,
                    titulo: 'Cloverfield',
                    anio_estreno: new Date('2008-01-18'),
                    descripcion: 'Nueva York es atacada por una criatura gigante.',
                    director: 'Matt Reeves',
                    genero: 'terror',
                    duracion: '1h 33m',
                    portada: 'http://172.20.0.10:3000/uploads/1747164228727-757029516.jpg',
                    trailer: 'https://www.youtube.com/embed/N1jYJHHKW3s?si=TNCLjY11m-jVfaZr',
                    valoracion: 0
                },
                {
                    ID: 11,
                    titulo: 'Iron Sky',
                    anio_estreno: new Date('2012-04-04'),
                    descripcion: 'Nazis en la Luna planean invadir la Tierra.',
                    director: 'Timo Vuorensola',
                    genero: 'ciencia ficcion',
                    duracion: '1h 33m',
                    portada: 'http://172.20.0.10:3000/uploads/1747164889545-552354189.jpg',
                    trailer: 'https://www.youtube.com/embed/11-GztyTi9A?si=UvW12qscKsa-RQBo',
                    valoracion: 0
                },
                {
                    ID: 12,
                    titulo: 'Mars Attacks!',
                    anio_estreno: new Date('1996-12-13'),
                    descripcion: 'Marcianos invaden la Tierra de forma absurda.',
                    director: 'Tim Burton',
                    genero: 'ciencia ficcion',
                    duracion: '1h 46m',
                    portada: 'http://172.20.0.10:3000/uploads/1747165100818-665728915.jpg',
                    trailer: 'https://www.youtube.com/embed/8aZAlpX5xPI?si=i07VaHZ_S_4-7G3C',
                    valoracion: 3
                },
                {
                    ID: 13,
                    titulo: 'Guardianes de la Galaxia',
                    anio_estreno: new Date('2014-08-01'),
                    descripcion: 'Un grupo de inadaptados lucha contra un tirano galáctico.',
                    director: 'James Gunn',
                    genero: 'accion',
                    duracion: '2h 1m',
                    portada: 'http://172.20.0.10:3000/uploads/1747165230521-905780763.jpg',
                    trailer: 'https://www.youtube.com/embed/qdIuXCfUKM8?si=Nf1MIFkG7RlYpts8',
                    valoracion: 0
                },
                {
                    ID: 14,
                    titulo: 'Dos Tontos Muy Tontos',
                    anio_estreno: new Date('1994-12-16'),
                    descripcion: 'Dos amigos hacen un viaje absurdo para devolver un maletín.',
                    director: 'Peter Farrelly',
                    genero: 'comedia',
                    duracion: '1h 47m',
                    portada: 'http://172.20.0.10:3000/uploads/1747165437687-427803174.jpg',
                    trailer: 'https://www.youtube.com/embed/xluAtecNoDw?si=cKgeOFtBcVGDKwif',
                    valoracion: 0
                },
                // ... Añade aquí las otras 31 películas
            ];
            await Pelicula.bulkCreate(peliculas);
            console.log('Películas insertadas por defecto');
        } else {
            console.log('Películas ya existen en la base de datos');
        }


        // Crear usuarios por defecto si no existen
        const cantidadUsuarios = await Usuario.count();
        if (cantidadUsuarios === 0) {
            const usuarios = [
                {
                    nombre: 'admin',
                    email: 'admin@example.com',
                    password: 'Admin1234',
                    rol: 'admin',
                    estado: 'activo',
                    imagenPerfil: null,
                    imagenCabecera: null
                },
                {
                    nombre: 'usuario1',
                    email: 'usuario1@example.com',
                    password: 'Usuario1234',
                    rol: 'estandar',
                    estado: 'activo',
                    imagenPerfil: null,
                    imagenCabecera: null
                },
                {
                    nombre: 'maria_gomez',
                    email: 'maria@example.com',
                    password: 'Maria1234',
                    rol: 'estandar',
                    estado: 'activo',
                    imagenPerfil: null,
                    imagenCabecera: null
                },
                {
                    nombre: 'juan_lopez',
                    email: 'juan@example.com',
                    password: 'Juan1234',
                    rol: 'estandar',
                    estado: 'activo',
                    imagenPerfil: null,
                    imagenCabecera: null
                },
                {
                    nombre: 'sara_mendez',
                    email: 'sara@example.com',
                    password: 'Sara1234',
                    rol: 'estandar',
                    estado: 'activo',
                    imagenPerfil: null,
                    imagenCabecera: null
                },
                {
                    nombre: 'david_ramos',
                    email: 'david@example.com',
                    password: 'David1234',
                    rol: 'estandar',
                    estado: 'activo',
                    imagenPerfil: null,
                    imagenCabecera: null
                },
                {
                    nombre: 'laura_vega',
                    email: 'laura@example.com',
                    password: 'Laura1234',
                    rol: 'estandar',
                    estado: 'activo',
                    imagenPerfil: null,
                    imagenCabecera: null
                },
                {
                    nombre: 'carlos_martin',
                    email: 'carlos@example.com',
                    password: 'Carlos1234',
                    rol: 'estandar',
                    estado: 'activo',
                    imagenPerfil: null,
                    imagenCabecera: null
                },
                {
                    nombre: 'elena_rodriguez',
                    email: 'elena@example.com',
                    password: 'Elena1234',
                    rol: 'estandar',
                    estado: 'activo',
                    imagenPerfil: null,
                    imagenCabecera: null
                },
                {
                    nombre: 'luis_fernandez',
                    email: 'luis@example.com',
                    password: 'Luis1234',
                    rol: 'estandar',
                    estado: 'activo',
                    imagenPerfil: null,
                    imagenCabecera: null
                }
            ];

            await Usuario.bulkCreate(usuarios);
            console.log('Usuarios por defecto insertados');
        } else {
            console.log('Usuarios ya existen en la base de datos');
        }

        const cantidadComentarios = await Comentario.count();
        if (cantidadComentarios === 0) {
            const usuarios = await Usuario.findAll({ limit: 5 });
            const peliculas = await Pelicula.findAll({ limit: 5 });

            if (usuarios.length > 0 && peliculas.length > 0) {
                const comentarios = [
                    {
                        texto: "Me encantó esta película, la recomiendo mucho.",
                        idUsuario: usuarios[0].ID,
                        idPelicula: peliculas[0].ID,
                        fecha: new Date(),
                        valoracion: 5
                    },
                    {
                        texto: "No me gustó tanto, esperaba más acción.",
                        idUsuario: usuarios[1].ID,
                        idPelicula: peliculas[1].ID,
                        fecha: new Date(),
                        valoracion: 2
                    },
                    {
                        texto: "La trama fue muy interesante y los efectos geniales.",
                        idUsuario: usuarios[2].ID,
                        idPelicula: peliculas[2].ID,
                        fecha: new Date(),
                        valoracion: 4
                    },
                    {
                        texto: "Buenísima para ver en familia.",
                        idUsuario: usuarios[3].ID,
                        idPelicula: peliculas[3].ID,
                        fecha: new Date(),
                        valoracion: 4
                    },
                    {
                        texto: "No la recomiendo, es muy lenta.",
                        idUsuario: usuarios[4].ID,
                        idPelicula: peliculas[4].ID,
                        fecha: new Date(),
                        valoracion: 1
                    },
                ];

                await Comentario.bulkCreate(comentarios);
                console.log('Comentarios por defecto insertados');
            } else {
                console.log('No hay suficientes usuarios o películas para crear comentarios por defecto.');
            }
        } else {
            console.log('Comentarios ya existen en la base de datos');
        }

        // Crear enlaces por defecto si no existen
        const cantidadEnlaces = await Enlace.count();
        if (cantidadEnlaces === 0) {
            const enlaces = [
                {
                    peliculaID: 1,
                    plataforma: 'Netflix',
                    url: 'https://www.netflix.com/title/60002360'
                },
                {
                    peliculaID: 2,
                    plataforma: 'Amazon',
                    url: 'https://www.amazon.com/Viernes-13/dp/B000I9XO5G'
                },
                {
                    peliculaID: 3,
                    plataforma: 'HBO',
                    url: 'https://www.hbo.com/movies/the-terminator'
                },
                {
                    peliculaID: 4,
                    plataforma: 'Disney',
                    url: 'https://www.disneyplus.com/movies/titanic'
                },
                {
                    peliculaID: 5,
                    plataforma: 'Movistar',
                    url: 'https://ver.movistarplus.es/ficha/el-laberinto-del-fauno'
                }
            ];

            await Enlace.bulkCreate(enlaces);
            console.log('Enlaces por defecto insertados');
        } else {
            console.log('Enlaces ya existen en la base de datos');
        }

        const cantidadMensajes = await Mensaje.count();
        if (cantidadMensajes === 0) {
            await Mensaje.bulkCreate([
                {
                    nombre: 'Laura Martínez',
                    email: 'laura@example.com',
                    asunto: 'Consulta sobre Jurassic Park',
                    contenido: 'Hola, me gustaría saber más sobre los dinosaurios que aparecen en la película.',
                    fecha: new Date()
                },
                {
                    nombre: 'Carlos Gómez',
                    email: 'carlos@example.com',
                    asunto: 'Felicitaciones',
                    contenido: '¡Gran sitio! Me encanta cómo presentaron la información sobre la saga de Jurassic Park.',
                    fecha: new Date()
                },
                {
                    nombre: 'Ana Torres',
                    email: 'ana@example.com',
                    asunto: 'Error en la página',
                    contenido: 'Noté un pequeño error en la descripción de Jurassic World. ¿Podrían revisarlo?',
                    fecha: new Date()
                }
            ]);
            console.log('Mensajes insertados correctamente.');
        }

        const cantidadReportes = await Reporte.count();
        if (cantidadReportes === 0) {
            const comentarios = await Comentario.findAll({ limit: 2 });
            const usuarios = await Usuario.findAll({ limit: 2 });

            if (comentarios.length && usuarios.length) {
                await Reporte.bulkCreate([
                    {
                        idUsuario: usuarios[0].ID,
                        idComentario: comentarios[0].ID,
                        motivo: 'Contenido ofensivo'
                    },
                    {
                        idUsuario: usuarios[1].ID,
                        idComentario: comentarios[1].ID,
                        motivo: 'Spam o publicidad no deseada'
                    }
                ]);
                console.log('Reportes de ejemplo insertados');
            }
        }


    })
    .catch((error) => console.error('Error sincronizando modelos:', error));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

