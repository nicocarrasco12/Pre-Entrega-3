const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        define: { timestamps: false }
    }
);

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
}

testConnection();

async function closeConnection() {
    try {
        await sequelize.close();
        console.log('Conexión cerrada correctamente.');
    } catch (error) {
        console.error('Error al cerrar la conexión:', error);
    }
}

module.exports = { sequelize, closeConnection };