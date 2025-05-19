const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Definición del modelo Comentario
const Comentario = sequelize.define('comentario', {
    // ID del comentario
    ID:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Texto del comentario
    texto:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    // ID del usuario que hizo el comentario
    idUsuario:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'ID'
        },
        onDelete: 'CASCADE'
    },
    // ID de la película a la que pertenece el comentario
    idPelicula:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'peliculas',
            key: 'ID'
        },
        onDelete: 'CASCADE'
    },
    // Fecha del comentario
    fecha:{
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    // Valoración del comentario
    valoracion:{
        type: DataTypes.INTEGER,
        allowNull: false
    }

}, {
    // Nombre de la tabla en la base de datos
    tableName: 'comentarios',
    // Desactivar timestamps automáticos
    timestamps: false
});

module.exports = Comentario;