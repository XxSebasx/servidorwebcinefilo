const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Definición del modelo Enlace
const Mensaje = sequelize.define('mensaje', {
    // ID del mensaje
    ID:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Nombre del remitente
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    // Email del remitente
    email:{
        type: DataTypes.STRING,
        allowNull: false
    },
    // Asunto del mensaje
    asunto:{
        type: DataTypes.STRING,
        allowNull: false
    },
    // Mensaje
    contenido:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    // Fecha del mensaje
    fecha:{
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }


}, {
    // Nombre de la tabla en la base de datos
    tableName: 'mensajes',
    // Desactivar timestamps automáticos
    timestamps: false
});

module.exports = Mensaje;