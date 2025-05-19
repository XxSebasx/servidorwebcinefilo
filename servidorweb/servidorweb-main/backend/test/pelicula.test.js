const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const peliculaController = require('../controllers/peliculaController');
const sequelize = require('../config/database');
const carteleraRouter = require('../routers/carteleraRouter');

const app = express();
app.use(bodyParser.json());
app.use('/', carteleraRouter);

// Sincronizar la base de datos antes de ejecutar las pruebas
beforeAll(async () => {
  await sequelize.sync({ force: false });
});

describe('Pelicula Controller', () => {
  // Prueba para obtener películas
  it('should get peliculas', async () => {
    const res = await request(app).get('/pelicula');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});