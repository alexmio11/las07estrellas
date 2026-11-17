# Registro de separación por lenguaje

## Fuente

`7_estrellas_juego_oficial(1).html`

- Tamaño original: 1,179,038 bytes
- Líneas originales: 7,967
- SHA-256 original: `7f5f935d75748d8b2b5446cc6ca361750c745ccfc515b602510a7fbe00bef117`

## Extracción

- HTML: contenido original conservado en `index.html`; se sustituyó el CSS embebido por una referencia a `css/style.css` y el JavaScript embebido por una referencia a `js/app.js`.
- CSS: bloque `<style>` extraído sin reescritura.
- JavaScript: bloque `<script>` inline extraído sin reescritura.
- C#: contenido del bloque `unity-code-block` decodificado de entidades HTML y guardado como archivo `.cs`; el bloque de vista previa original permanece en el HTML.

## Integridad

- Caracteres CSS extraídos: 2,504
- Caracteres JavaScript extraídos: 306,782
- Caracteres C# extraídos: 2,205
- Bloques `<style>` originales: 1
- Etiquetas `<script>` originales: 2 (una dependencia externa Tailwind y un script inline de la aplicación)
- Bloques C# de vista previa: 1

## Validaciones

- `node --check` sobre `js/app.js`.
- Comprobación de que `index.html` referencia `css/style.css` y `js/app.js`.
- Comprobación de que el contenido original de la vista previa C# se conserva en HTML y también existe en `unity-csharp/TrainStationLevelManager.cs`.
- Comparación de reconstrucción: se reinsertaron los bloques CSS y JS extraídos en sus posiciones originales y se comparó el resultado con la fuente original.

Esta validación comprueba integridad de separación y sintaxis JS, no una prueba funcional completa en navegador.
