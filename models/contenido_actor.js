const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const ContenidoActor = sequelize.define('ContenidoActor', {
    id_contenido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_actor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    }
}, {
    tableName: 'contenido_actor',
    timestamps: false
});

module.exports = ContenidoActor;