// Configuración general. Aquí cambias nombre, rutas y rompecabezas.
export const CONFIG = {
  student: 'Antonella',
  paths: {
    words: 'assets/images/words',       // una imagen por palabra (ver data/vocabulary.js)
    puzzles: 'assets/images/puzzles',   // imágenes de los rompecabezas
    music: 'assets/audio/music.mp3',    // pon aquí tu música (si no existe, suena una melodía suave)
  },
  // Para cambiar una imagen: reemplaza el archivo con el mismo nombre
  // o cambia 'file' aquí (puede ser .jpg, .png, .svg, .webp).
  puzzles: [
    { file: 'puzzle1.svg', en: 'Rainbow garden', es: 'Jardín arcoíris' },
    { file: 'puzzle2.svg', en: 'Starry night', es: 'Noche estrellada' },
  ],
};
