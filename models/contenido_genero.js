const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const ContenidoGenero = sequelize.define('ContenidoGenero', {
    id_contenido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_genero: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    }
}, {
    tableName: 'contenido_genero',
    timestamps: false
});

module.exports = ContenidoGenero;