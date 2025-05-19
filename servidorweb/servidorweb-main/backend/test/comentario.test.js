const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const comentarioController = require('../controllers/comentarioController');
const sequelize = require('../config/database');
const carteleraRouter = require('../routers/carteleraRouter');

const app = express();
app.use(bodyParser.json());
app.use('/', carteleraRouter);

// Sincronizar la base de datos antes de ejecutar las pruebas
beforeAll(async () => {
  await sequelize.sync({ force: false });
});

describe('Comentario Controller', () => {
  // Prueba para obtener comentarios
  it('should get comentarios', async () => {
    const res = await request(app).get('/comentario/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});