const fs = require('node:fs/promises');

async function leerArchivoJson(ruta) {
  try {
    const contenido = await fs.readFile(ruta, 'utf-8');
    return JSON.parse(contenido);
  } catch (error) {
    console.error('Error al leer o interpretar el archivo JSON:', error.message);
    throw error;
  }
}

module.exports = { leerArchivoJson };