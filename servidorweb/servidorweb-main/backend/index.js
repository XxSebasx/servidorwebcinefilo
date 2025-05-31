require('dotenv').config();
const express = require("express");

//helmet es un paquete que nos ayuda a proteger nuestra aplicación de ciertas vulnerabilidades

const bodyParser = require("body-parser");
const path = require("path");
const session = require('express-session');
const fs = require('fs');

const app = express();
const sequelize = require('./config/database');
require('./models/relacion');

const Pelicula = require('./models/pelicula'); // Importa el modelo Pelicula

const cors = require('cors');
app.use(cors({
    origin: ['http://localhost:4200', 'http://192.168.1.146:4200']
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
    secret: 'mi_secreto_seguro', // Cambia esto por una clave secreta más segura
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Usa `true` si estás usando HTTPS
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

        // Insertar datos por defecto solo si no existen
        const existe = await Pelicula.findOne({ where: { ID: 1 } });
        if (!existe) {
            await Pelicula.create({
                titulo: 'jurassic park',
                anio_estreno: new Date('1993-09-30'),
                descripcion: 'El multimillonario John Hammond hace realidad su sueño de clonar dinosaurios...',
                director: 'Steven Spielberg',
                genero: 'ciencia ficcion',
                duracion: '2h',
                portada: 'http://172.20.0.10:3000/uploads/1746101861761-997615221.jpg',
                trailer: 'https://www.youtube.com/embed/QWBKEmWWL38?si=L-TK9-liL7RfnVDJ',
                valoracion: 5
            });
            console.log('Datos por defecto insertados');
        } else {
            console.log('Datos por defecto ya existen, no se insertan');
        }
    })
    .catch((error) => console.error('Error sincronizando modelos:', error));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
