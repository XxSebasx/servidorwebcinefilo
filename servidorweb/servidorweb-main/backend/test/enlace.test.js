const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('../config/database');
const carteleraRouter = require('../routers/carteleraRouter');

const app = express();
app.use(bodyParser.json());
app.use('/', carteleraRouter);

// Sincronizar la base de datos antes de ejecutar las pruebas
beforeAll(async () => {
  await sequelize.sync({ force: false });
});

describe('Enlace Controller', () => {
  // Prueba para crear un enlace
  it('should create an enlace', async () => {
    const enlaceData = {
      peliculaID: 1,
      amazon: "https://amazon.com/movie",
      netflix: "https://netflix.com/movie",
      disney: "https://disney.com/movie",
      hbo: "https://hbo.com/movie",
      movistar: "https://movistar.com/movie"
    };

    const res = await request(app)
      .post('/enlace')
      .send(enlaceData);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('ID');
    expect(res.body.amazon).toEqual(enlaceData.amazon);
  });

  it('should not create enlace with invalid url', async () => {
    const enlaceData = {
      peliculaID: 1,
      plataforma: "Netflix",
      url: "not-a-url"
    };
    const res = await request(app).post('/enlace').send(enlaceData);
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors).toBeDefined();
  });
});