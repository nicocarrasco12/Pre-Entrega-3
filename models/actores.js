const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Actor = sequelize.define('Actor', {
    id_actor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre_actor: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: 'actores',
    timestamps: false
});

module.exports = Actor;