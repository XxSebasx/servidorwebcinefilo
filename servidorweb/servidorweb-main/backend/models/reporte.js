const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Definición del modelo Enlace
const Reporte = sequelize.define(
  "reporte",
  {
    // ID del reporte
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    //Usuario que reporta
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "ID",
      },
      onDelete: "CASCADE",
    },
    //id del comentario reportado
    idComentario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "comentarios",
        key: "ID",
      },
      onDelete: "CASCADE",
    },
    // Fecha del reporte
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    // Motivo del reporte
    motivo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
  },
  {
    // Nombre de la tabla en la base de datos
    tableName: "reportes",
    // Desactivar timestamps automáticos
    timestamps: false,
  }
);

module.exports = Reporte;
