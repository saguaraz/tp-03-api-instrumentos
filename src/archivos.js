const fs = require('node:fs/promises');

async function leerArchivoJson(rutaArchivo) {
  const contenidoTexto = await fs.readFile(rutaArchivo, 'utf8');
  return JSON.parse(contenidoTexto);
}

module.exports = {
  leerArchivoJson
};