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

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:4200', // el puerto donde corre tu Angular
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
    .then(() => console.log('Modelos sincronizados con la base de datos'))
    .catch((error) => console.error('Error sincronizando modelos:', error));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});