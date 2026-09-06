const express = require('express');
const path = require('node:path');
const { leerArchivoJson } = require('./archivos.js');

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    const rutaJson = path.join(__dirname, '..', 'datos', 'instrumentos.json');
    const instrumentos = await leerArchivoJson(rutaJson);

    const app = express();
    app.use(express.json());

    app.get('/', (req, res) => {
  res.send('¡El servidor está funcionando!');
});

    // Listado y Filtro por familia (GET /api/instrumentos)
app.get('/api/instrumentos', (req, res) => {
  const { familia } = req.query;

  // Si envían ?familia=..., filtramos sin importar mayúsculas o minúsculas
  if (familia) {
    const filtrados = instrumentos.filter(
      item => item.familia.toLowerCase() === familia.toLowerCase()
    );
    return res.status(200).json(filtrados);
  }

  // Si no envían el parámetro, devuelve todos
  res.status(200).json(instrumentos);
});

    app.listen(PORT, () => {
      console.log(`Servidor iniciado con éxito en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Error al iniciar:', error.message);
    process.exit(1);
  }
}

main();