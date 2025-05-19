const Pelicula = require('./pelicula');
const Usuario = require('./usuario');
const Comentario = require('./comentario');
const Enlace = require('./enlaces');
const Reporte = require('./reporte');
const Mensaje = require('./mensaje');

Pelicula.hasMany(Comentario, {foreignKey: 'idPelicula'});
Comentario.belongsTo(Pelicula, {foreignKey: 'idPelicula'});

Usuario.hasMany(Comentario, {foreignKey: 'idUsuario'});
Comentario.belongsTo(Usuario, {foreignKey: 'idUsuario'});

Pelicula.hasMany(Enlace, {foreignKey: 'peliculaID'});
Enlace.belongsTo(Pelicula, {foreignKey: 'peliculaID'});

Usuario.hasMany(Reporte, {foreignKey: 'idUsuario'});
Reporte.belongsTo(Usuario, {foreignKey: 'idUsuario'});

Comentario.hasMany(Reporte, {foreignKey: 'idComentario'});
Reporte.belongsTo(Comentario, {foreignKey: 'idComentario'});

module.exports = {
    Pelicula,
    Usuario,
    Comentario,
    Enlace,
    Reporte,
    Mensaje
};