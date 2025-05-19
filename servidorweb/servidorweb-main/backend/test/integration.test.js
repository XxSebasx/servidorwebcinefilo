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

describe('Integration Test', () => {
  // Prueba de integración para crear y obtener un usuario
  it('should create a user and then get the user', async () => {
    const userData = {
      nombre: "Test User",
      email: "testuser@example.com",
      password: "password123"
    };

    // Crear un usuario
    const createUserRes = await request(app)
      .post('/usuario')
      .send(userData);

    expect(createUserRes.statusCode).toEqual(200);
    expect(createUserRes.body[0]).toHaveProperty('ID'); // Acceder al primer elemento del array
    const userId = createUserRes.body[0].ID;

    // Obtener el usuario creado
    const getUserRes = await request(app)
      .get(`/usuario/${userId}`);

    expect(getUserRes.statusCode).toEqual(200);
    expect(getUserRes.body.email).toEqual(userData.email);
  });
});