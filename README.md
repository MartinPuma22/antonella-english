# 🌸 Antonella aprende inglés

Página web 100 % frontend (HTML + CSS + JavaScript, sin dependencias) con 5 juegos en una sola página:
sopa de letras, rompecabezas, memoria, "¿Qué es?" y "Ordena la palabra".

## Cómo abrirla en Visual Studio Code
1. Abre la carpeta `antonella-english` en VS Code (Archivo → Abrir carpeta).
2. Instala la extensión **Live Server** (VS Code te la sugerirá).
3. Clic derecho en `index.html` → **Open with Live Server**. Se abre en `http://127.0.0.1:5500`.

Alternativa por terminal: `npx serve . -l 5500` o `python -m http.server 5500`.
(Hace falta un servidor local porque usa módulos de JavaScript; no funciona con doble clic en el archivo.)

## Estructura
```
index.html                 Página única
src/
  css/base.css             Colores (tokens), cabecera, botones, layout
  css/games.css            Estilos de cada juego
  js/main.js               Arranque, pestañas, estrellas, botones
  js/config.js             Nombre, rutas de imágenes/música, rompecabezas
  js/data/vocabulary.js    Palabras: inglés, español, imagen
  js/core/                 utils.js (ayudas) y audio.js (música, sonidos, voz)
  js/games/                Un archivo por juego + index.js (lista de juegos)
assets/
  images/words/            Una imagen por palabra
  images/puzzles/          Imágenes de rompecabezas
  audio/music.mp3          Tu música (opcional)
```

## Cambios habituales
- **Cambiar una imagen:** reemplaza el archivo en `assets/images/words/` con el mismo nombre (apple.svg, cat.svg…). Si usas otro formato (por ejemplo `apple.jpg`), cambia el nombre en `data/vocabulary.js`.
- **Agregar palabras:** añade una línea en `data/vocabulary.js` y su imagen. Todos los juegos la usan solos.
- **Rompecabezas:** pon tus fotos en `assets/images/puzzles/` (mejor cuadradas) y regístralas en `config.js`.
- **Música:** guarda tu canción como `assets/audio/music.mp3`. Si no existe, suena una melodía suave generada.
- **Colores:** edita las variables al inicio de `src/css/base.css`.
- **Nuevo juego:** copia un archivo de `src/js/games/`, cambia su lógica y agrégalo en `games/index.js`.
