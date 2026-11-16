const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Genero = sequelize.define('Genero', {
    id_genero: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: 'géneros',
    timestamps: false
});

module.exports = Genero;