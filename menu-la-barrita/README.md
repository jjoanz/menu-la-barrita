# Menú Digital — La Barrita

## Qué cambió respecto al archivo original
- `save()` / `load()` ya no usan solo `localStorage`: ahora también leen/escriben en `/api/menu`,
  que es una Netlify Function respaldada por **Netlify Blobs** (almacenamiento compartido entre todos
  los dispositivos que abran el sitio).
- `localStorage` se mantiene como caché local (por si se cae la red un instante), pero la fuente
  de verdad ahora es el servidor.
- Se agregó **polling cada 20 segundos**: cualquier pantalla abierta (ej. el Fire Stick) revisa el
  servidor y se actualiza sola si detecta cambios — sin necesidad de recargar manualmente.
- Se agregó un parámetro `?tv=1` en la URL: si lo agregas, la página abre directo en modo
  **Proyección** (útil para el Fire Stick, así no hay que tocar nada al encenderlo).

## 1. Desplegar con Netlify CLI (una sola vez la instalación)

```powershell
npm install -g netlify-cli
netlify login
```

Dentro de esta carpeta (`menu-la-barrita`):

```powershell
npm install
netlify link
```

`netlify link` te va a preguntar a qué sitio existente conectar esta carpeta — elige el sitio
donde ya tienes `menu-la-barrita.html` subido por drag & drop.

Luego, cada vez que quieras actualizar el sitio (en vez de arrastrar la carpeta):

```powershell
netlify deploy --prod
```

Esto sube el HTML **y** la función serverless con Netlify Blobs.

## 2. Verificar que la API funciona

Después del deploy, abre en el navegador:

```
https://TU-SITIO.netlify.app/api/menu
```

Debe devolver algo como `{"menu":[],"restName":"La Barrita"}`. Si ves un error 404, revisa que
`netlify.toml` se haya subido junto con la carpeta `netlify/functions`.

## 3. Uso normal (PC / celular — administrar el menú)

Abre `https://TU-SITIO.netlify.app/` normal, edita el menú en la pestaña Admin. Cada cambio se
guarda automáticamente en el servidor compartido.

## 4. Configurar el Fire Stick (solo muestra, no administra)

1. Instala **Fully Kiosk Browser** desde la Amazon Appstore.
2. Configura la URL de inicio como:
   ```
   https://TU-SITIO.netlify.app/?tv=1
   ```
   (el `?tv=1` hace que abra directo en modo Proyección, sin mostrar el panel admin).
3. Activa en Fully Kiosk:
   - **Start on boot** (arranque automático)
   - **Kiosk mode** (pantalla completa, sin salir accidentalmente)
   - **Auto reload** — opcional, ya no es estrictamente necesario porque el polling cada 20s ya
     refresca el contenido, pero puedes dejar un auto-reload cada 1-2 horas como respaldo por si
     el JS se cuelga.

Como no pediste contraseña en el admin, cualquiera con la URL exacta puede editar el menú — no
compartas ese link públicamente. Si más adelante quieres una capa extra de discreción, se puede
mover el admin a una ruta menos obvia (ej. `/admin-9f2a`) sin mucho esfuerzo.
