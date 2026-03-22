# Biblioteca de Salidas Educativas · Frontend para GitHub Pages

Este paquete está pensado para usar **Google Sheets como backend** y **GitHub Pages como frontend**.

## Qué trae
- `index.html` → estructura principal de la app
- `styles.css` → interfaz visual responsive
- `app.js` → lectura de Google Sheets, filtros, tarjetas, detalle y favoritas
- `config.js` → conexión simple con tu hoja

## Cómo conectarlo a Google Sheets

### Paso 1. Subí el Excel a Google Drive
1. Entrá a Google Drive.
2. Subí el archivo Excel de base de datos.
3. Abrilo con Google Sheets.
4. Verificá que la pestaña principal se llame `salidas`.

### Paso 2. Publicá o compartí la hoja
Tenés dos caminos:

#### Camino recomendado: usar `spreadsheetId`
1. Abrí la hoja.
2. Copiá el ID del link.
   - Ejemplo: `https://docs.google.com/spreadsheets/d/ABC123XYZ456/edit`
   - El ID es `ABC123XYZ456`
3. En `config.js`, pegalo en:
```js
spreadsheetId: "ABC123XYZ456"
```
4. Asegurate de que la hoja pueda leerse desde la web.

#### Camino alternativo: publicar como CSV
1. En Google Sheets: **Archivo → Compartir → Publicar en la web**.
2. Elegí la pestaña `salidas`.
3. Publicala como CSV.
4. Copiá la URL directa y pegala en:
```js
csvUrl: "https://docs.google.com/spreadsheets/d/e/.../pub?gid=0&single=true&output=csv"
```

## Cómo subirlo a GitHub Pages
1. Creá un repositorio nuevo en GitHub.
2. Subí estos archivos tal como están.
3. Entrá a **Settings → Pages**.
4. Elegí desplegar desde la rama principal.
5. Guardá.
6. GitHub te va a dar una URL pública.

## Cómo carga los datos
La app espera estos encabezados en la pestaña `salidas`:
- `id`
- `title`
- `summary`
- `description`
- `level`
- `subject`
- `district`
- `locality`
- `trip_type`
- `duration`
- `cost_band`
- `free`
- `featured`
- `published`
- `destination_name`
- `maps_url`
- `pdf_url`
- `updated_at`

Puede leer más columnas también. Mientras estén en la hoja, la app las usa en la ficha de detalle.

## Extras que ya tiene
- búsqueda por texto
- filtros por nivel, materia, distrito, tipo, duración, costo y entorno
- favoritas guardadas en el navegador
- modal de detalle
- botón para compartir búsqueda
- diseño responsive para celular

## Importante
Si no hay datos publicados o la hoja no responde, la app muestra un estado vacío amigable para la comunidad.
