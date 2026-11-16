const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Contenido = sequelize.define('Contenido', {
    id_contenido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    titulo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    sinopsis: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    temporadas: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    trailer: {
        type: DataTypes.STRING(250),
        allowNull: true
    },
    id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'contenido',
    timestamps: false
});

module.exports = Contenido;