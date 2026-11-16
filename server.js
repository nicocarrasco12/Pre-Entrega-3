const express = require('express');
require('dotenv').config();
const { sequelize } = require('./database');
const { Op } = require('sequelize');

const Contenido = require('./models/contenido');
const Categoria = require('./models/categorías');
const Genero = require('./models/géneros');
const Actor = require('./models/actores');
const ContenidoActor = require('./models/contenido_actor');
const ContenidoGenero = require('./models/contenido_genero');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/contenido', async (req, res) => {
    try {
        const contenidos = await Contenido.findAll();
        res.json(contenidos);
    } catch (error) {
        console.error('Error al consultar el contenido:', error);
        res.status(500).json({ error: 'Error al consultar el contenido.' });
    }
});

app.get('/contenido/titulo/:titulo', async (req, res) => {
    try {
        const { titulo } = req.params;

        if (!titulo || titulo.trim() === "") {
            return res.status(400).json({ error: 'El parámetro título no puede estar vacío.' });
        }

        const resultados = await Contenido.findAll({
            where: {
                titulo: { [Op.like]: `%${titulo}%` }
            }
        });

        if (resultados.length === 0) {
            return res.status(404).json({ error: `No se encontraron contenidos que coincidan con '${titulo}'.` });
        }

        res.json(resultados);
    } catch (error) {
        console.error('Error al buscar contenido por título:', error);
        res.status(500).json({ error: 'Error al buscar contenido por título.' });
    }
});

app.post('/contenido', async (req, res) => {
    try {
        const { titulo, sinopsis, temporadas, trailer, id_categoria } = req.body;
        
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'El cuerpo de la petición no puede estar vacío.' });
        }
        if (!titulo || !sinopsis || !temporadas || !id_categoria) {
            return res.status(400).json({ error: 'Faltan campos obligatorios en el body.' });
        }
        if (!isNaN(titulo)) {
            return res.status(400).json({ error: 'El título no puede ser numérico.' });
        }

        const nuevo = await Contenido.create({
            titulo,
            sinopsis,
            temporadas,
            trailer,
            id_categoria: parseInt(id_categoria)
        });
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el contenido' });
    }
});

app.put('/contenido/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'El ID debe ser un número entero.' });

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'El cuerpo de la petición no puede estar vacío.' });
        }

        const item = await Contenido.findByPk(id);
        if (!item) return res.status(404).json({ error: 'Registro no encontrado' });

        await item.update(req.body);
        res.json({ message: 'Actualizado correctamente', item });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el contenido' });
    }
});

app.delete('/contenido/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'El ID debe ser un número entero.' });

        const item = await Contenido.findByPk(id);
        if (!item) return res.status(404).json({ error: 'Registro no encontrado' });

        await item.destroy();
        res.json({ message: 'Eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el contenido' });
    }
});

app.get('/categorias', async (req, res) => {
    try {
        const [categorias] = await sequelize.query('SELECT * FROM categorías');
        res.json(categorias);
    } catch (error) {
        console.error('Error al consultar categorías:', error);
        res.status(500).json({ error: 'Error al consultar categorías.' });
    }
});

app.get('/categorias/:nombre', async (req, res) => {
    try {
        const { nombre } = req.params;

        if (!nombre || nombre.trim() === "") {
            return res.status(400).json({ error: 'El parámetro de categoría no puede estar vacío.' });
        }
        if (!isNaN(nombre)) {
            return res.status(400).json({ error: 'El nombre de la categoría debe ser texto, no un número.' });
        }

        const [categorias] = await sequelize.query(
            'SELECT * FROM categorías WHERE nombre LIKE :nombreBusqueda',
            { replacements: { nombreBusqueda: `%${nombre}%` } }
        );

        if (categorias.length === 0) {
            return res.status(404).json({ error: `No se encontró la categoría '${nombre}'.` });
        }

        const resultadoFinal = [];
        for (const cat of categorias) {
            const [contenidos] = await sequelize.query(
                'SELECT * FROM contenido WHERE id_categoria = :idCat',
                { replacements: { idCat: cat.id_categoría } }
            );

            resultadoFinal.push({
                id_categoría: cat.id_categoría,
                nombre: cat.nombre,
                contenido: contenidos
            });
        }

        res.json(resultadoFinal);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al buscar en categorías' });
    }
});

app.post('/categorias', async (req, res) => {
    try {
        const { nombre } = req.body;
        if (!req.body || Object.keys(req.body).length === 0) return res.status(400).json({ error: 'Body vacío' });
        if (!nombre) return res.status(400).json({ error: 'El campo nombre es obligatorio.' });
        const nuevo = await Categoria.create({ nombre });
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear categoría' });
    }
});

app.put('/categorias/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'ID no válido' });
        if (!req.body || Object.keys(req.body).length === 0) return res.status(400).json({ error: 'Body vacío' });
        const item = await Categoria.findByPk(id);
        if (!item) return res.status(404).json({ error: 'No encontrado' });
        await item.update(req.body);
        res.json({ message: 'Actualizado', item });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar' });
    }
});

app.delete('/categorias/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
        const item = await Categoria.findByPk(id);
        if (!item) return res.status(404).json({ error: 'No encontrado' });
        await item.destroy();
        res.json({ message: 'Eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar' });
    }
});


app.get('/generos', async (req, res) => {
    try {
        const [generos] = await sequelize.query('SELECT * FROM géneros');
        res.json(generos);
    } catch (error) {
        console.error('Error al consultar géneros:', error);
        res.status(500).json({ error: 'Error al consultar géneros.' });
    }
});

app.get('/generos/:nombre', async (req, res) => {
    try {
        const nombreparam = req.params.nombre.toLowerCase();
        const nombre = nombreparam.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        
        if (!nombre || nombre.trim() === "") {
            return res.status(400).json({ error: 'El parámetro de género no puede estar vacío.' });
        }
        if (!isNaN(nombre)) {
            return res.status(400).json({ error: 'El nombre del género debe ser texto, no un número.' });
        }

        const [generos] = await sequelize.query(
            'SELECT * FROM géneros WHERE nombre LIKE :nombreBusqueda',
            { replacements: { nombreBusqueda: `%${nombre}%` } }
        );

        if (generos.length === 0) {
            return res.status(404).json({ error: `No se encontró el género '${nombre}'.` });
        }

        const resultadoFinal = [];
        for (const gen of generos) {
            const [contenidos] = await sequelize.query(
                `SELECT c.* FROM contenido c
                 JOIN contenido_genero cg ON c.id_contenido = cg.id_contenido
                 WHERE cg.id_genero = :idGen`,
                { replacements: { idGen: gen.id_genero } }
            );

            resultadoFinal.push({
                id_genero: gen.id_genero,
                nombre: gen.nombre,
                contenido: contenidos
            });
        }

        res.json(resultadoFinal);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al buscar contenido por género' });
    }
});

app.post('/generos', async (req, res) => {
    try {
        const { nombre } = req.body;
        if (!req.body || Object.keys(req.body).length === 0) return res.status(400).json({ error: 'Body vacío' });
        if (!nombre) return res.status(400).json({ error: 'El campo nombre es obligatorio.' });
        const nuevo = await Genero.create({ nombre });
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear género' });
    }
});

app.put('/generos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
        if (!req.body || Object.keys(req.body).length === 0) return res.status(400).json({ error: 'Body vacío' });
        const item = await Genero.findByPk(id);
        if (!item) return res.status(404).json({ error: 'No encontrado' });
        await item.update(req.body);
        res.json({ message: 'Actualizado', item });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar' });
    }
});

app.delete('/generos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'ID no válido' });
        const item = await Genero.findByPk(id);
        if (!item) return res.status(404).json({ error: 'No encontrado' });
        await item.destroy();
        res.json({ message: 'Eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar' });
    }
});

app.get('/actores', async (req, res) => {
    try {
        const [actores] = await sequelize.query('SELECT * FROM actores');
        res.json(actores);
    } catch (error) {
        console.error('Error al consultar actores:', error);
        res.status(500).json({ error: 'Error al consultar actores.' });
    }
});

app.get('/actores/:nombre', async (req, res) => {
    try {
        const { nombre } = req.params;

        if (!nombre || nombre.trim() === "") {
            return res.status(400).json({ error: 'El parámetro de actor no puede estar vacío.' });
        }
        if (!isNaN(nombre)) {
            return res.status(400).json({ error: 'El nombre del actor debe ser texto, no un número.' });
        }

        const [actores] = await sequelize.query(
            'SELECT * FROM actores WHERE nombre_actor LIKE :nombreBusqueda',
            { replacements: { nombreBusqueda: `%${nombre}%` } }
        );

        if (actores.length === 0) {
            return res.status(404).json({ error: `No se encontró al actor '${nombre}'.` });
        }

        const resultadoFinal = [];
        for (const act of actores) {
            const [contenidos] = await sequelize.query(
                `SELECT c.* FROM contenido c
                 JOIN contenido_actor ca ON c.id_contenido = ca.id_contenido
                 WHERE ca.id_actor = :idActor`,
                { replacements: { idActor: act.id_actor } }
            );

            resultadoFinal.push({
                id_actor: act.id_actor,
                nombre_actor: act.nombre_actor,
                contenido: contenidos
            });
        }

        res.json(resultadoFinal);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al buscar contenido por actor' });
    }
});

app.post('/actores', async (req, res) => {
    try {
        const { nombre_actor } = req.body;
        if (!req.body || Object.keys(req.body).length === 0) return res.status(400).json({ error: 'Body vacío' });
        if (!nombre_actor) return res.status(400).json({ error: 'El campo nombre_actor es obligatorio.' });
        const nuevo = await Actor.create({ nombre_actor });
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear actor' });
    }
});

app.put('/actores/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'ID no válido' });
        if (!req.body || Object.keys(req.body).length === 0) return res.status(400).json({ error: 'Body vacío' });
        const item = await Actor.findByPk(id);
        if (!item) return res.status(404).json({ error: 'No encontrado' });
        await item.update(req.body);
        res.json({ message: 'Actualizado', item });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar' });
    }
});

app.delete('/actores/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'ID no válido' });
        const item = await Actor.findByPk(id);
        if (!item) return res.status(404).json({ error: 'No encontrado' });
        await item.destroy();
        res.json({ message: 'Eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});