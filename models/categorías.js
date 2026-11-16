const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Categoria = sequelize.define('Categoria', {
    id_categoría: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'categorías',
    timestamps: false
});

module.exports = Categoria;