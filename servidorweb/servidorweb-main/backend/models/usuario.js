const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');


// Definición del modelo Usuario
const Usuario = sequelize.define('Usuario', {
    // ID del usuario
    ID:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Nombre del usuario
    nombre: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
    },
    // Email del usuario
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    // Contraseña del usuario
    password:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [8, 20],
            isAlphanumeric: true
        }
    },
    // Fecha de creación del usuario
    fecha:{
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    // Rol del usuario (admin o usuario)
    rol:{
        type: DataTypes.ENUM('admin', 'estandar'),
        allowNull: false,
        defaultValue: 'estandar'
    },
    estado:{
        type: DataTypes.ENUM('activo', 'inactivo'),
        allowNull: false,
        defaultValue: 'activo'
    },
    // Imagen del usuario
    imagenPerfil:{
        type: DataTypes.STRING,
        allowNull: true
     
    },
    imagenCabecera:{
        type: DataTypes.STRING,
        allowNull: true,
    },


}, {
    // Nombre de la tabla en la base de datos
    tableName: 'usuarios',
    // Desactivar timestamps automáticos
    timestamps: false
});


module.exports = Usuario;
