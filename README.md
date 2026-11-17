# LAS 07 ESTRELLAS — Archivos separados por lenguaje

Esta estructura separa el archivo original por lenguaje sin rediseñar ni reescribir la lógica.

## Estructura

- `index.html` — estructura, contenido, interfaz, elementos, identificadores, formularios, modales y paneles HTML.
- `css/style.css` — reglas CSS que estaban dentro del bloque `<style>` original.
- `js/app.js` — código JavaScript completo que estaba dentro del bloque `<script>` original.
- `unity-csharp/TrainStationLevelManager.cs` — código C# que el HTML original muestra como ejemplo dentro de la sección Unity.
- `docs/` — documentación del proceso de separación.

## Cómo ejecutar

1. Mantén la estructura de carpetas tal como está.
2. Abre `index.html` en Chrome o Edge, o usa Live Server en Visual Studio Code.
3. Se requiere conexión a Internet para cargar Tailwind CSS y Google Fonts, que ya eran dependencias externas del archivo original.

## Alcance y preservación

- No se eliminaron variables, funciones, clases, elementos HTML, reglas CSS ni bloques de código del archivo fuente.
- El HTML conserva el bloque de vista previa de C# tal como se mostraba originalmente.
- El archivo `.cs` es una copia independiente del código C# visible en esa vista previa. No se ha añadido al runtime JavaScript del navegador ni se ha convertido en un proyecto Unity.
- El JavaScript se mantiene en un único `app.js` para no alterar dependencias, orden de ejecución ni alcance global.
- No se renombraron identificadores ni se modificó la lógica de juego.

## Nota sobre dependencias

El archivo original ya cargaba Tailwind CSS desde `https://cdn.tailwindcss.com/3.4.17` y Google Fonts desde `fonts.googleapis.com`. Estas referencias se conservaron.

La separación de archivos no equivale a una modularización interna del JavaScript ni a una migración del juego a Unity.
