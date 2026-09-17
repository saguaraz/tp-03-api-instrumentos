const express = require('express');
const path = require('node:path');
const { leerArchivoJson } = require('./archivos.js');

const PORT = process.env.PORT || 3000;
const rutaJson = path.join(__dirname, '..', 'datos', 'instrumentos.json');

// Arreglo en memoria para conservar modificaciones de la sesión activa
let instrumentos = [];

async function main() {
  try {
    // 1. Cargar datos iniciales antes de iniciar el servidor
    instrumentos = await leerArchivoJson(rutaJson);

    const app = express();

    // Middleware global obligatorio para procesar JSON en req.body
    app.use(express.json());

    // 1. Bienvenida (GET /)
    app.get('/', (req, res) => {
      res.status(200).json({
        mensaje: 'Bienvenido a la API de Instrumentos Musicales',
        estado: 'Disponible'
      });
    });

    // 2. Listado y Filtro opcional por familia (GET /api/instrumentos)
    app.get('/api/instrumentos', (req, res) => {
      const { familia } = req.query;

      if (familia) {
        const filtrados = instrumentos.filter(
          item => item.familia.toLowerCase() === familia.toLowerCase()
        );
        return res.status(200).json(filtrados);
      }

      res.status(200).json(instrumentos);
    });

    // 3. Detalle por ID (GET /api/instrumentos/:id)
    app.get('/api/instrumentos/:id', (req, res) => {
      const id = parseInt(req.params.id, 10);
      const instrumento = instrumentos.find(item => item.id === id);

      if (!instrumento) {
        return res.status(404).json({
          error: `No se encontró ningún instrumento con el ID ${id}`
        });
      }

      res.status(200).json(instrumento);
    });

    // 4. Creación en memoria (POST /api/instrumentos)
    app.post('/api/instrumentos', (req, res) => {
      const { nombre, familia, origen, descripcion, disponible } = req.body;

      // Validar que no falte ningún campo obligatorio (disponible puede ser false)
      if (
        !nombre ||
        !familia ||
        !origen ||
        !descripcion ||
        disponible === undefined
      ) {
        return res.status(400).json({
          error: 'Todos los campos son obligatorios: nombre, familia, origen, descripcion y disponible.'
        });
      }

      // Generar nuevo ID basado en el último elemento
      const nuevoId = instrumentos.length > 0 
        ? Math.max(...instrumentos.map(item => item.id)) + 1 
        : 1;

      const nuevoInstrumento = {
        id: nuevoId,
        nombre,
        familia,
        origen,
        descripcion,
        disponible: Boolean(disponible)
      };

      // Agregar al arreglo en memoria (sin alterar instrumentos.json)
      instrumentos.push(nuevoInstrumento);

      res.status(201).json(nuevoInstrumento);
    });

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor iniciado con éxito en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Error de inicio de la aplicación:', error.message);
    process.exit(1);
  }
}

main();