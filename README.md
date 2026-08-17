# Menú Digital — La Barrita

## Qué cambió respecto al archivo original
- `save()` / `load()` ya no usan solo `localStorage`: ahora también leen/escriben directo en
  **Supabase** (tablas `menu_items` y `menu_settings`, más el bucket `menu-photos` para las fotos) —
  almacenamiento compartido entre todos los dispositivos que abran el sitio. La conexión se hace
  con el cliente `@supabase/supabase-js` cargado por CDN, usando la `anon public key` embebida en
  `index.html` (es segura de exponer: el acceso real lo controlan las políticas RLS de las tablas).
- `localStorage` se mantiene como caché local (por si se cae la red un instante), pero la fuente
  de verdad ahora es Supabase.
- Las fotos (de plato y de categoría) se redimensionan/comprimen en el navegador (canvas) y se suben
  como archivo real al bucket `menu-photos`; solo la URL pública se guarda en la fila — ya no viajan
  como base64 gigante dentro del JSON.
- Se agregó **polling cada 20 segundos**: cualquier pantalla abierta (ej. el Fire Stick) revisa
  Supabase y se actualiza sola si detecta cambios — sin necesidad de recargar manualmente.
- Se agregó un parámetro `?tv=1` en la URL: si lo agregas, la página abre directo en modo
  **Proyección** (útil para el Fire Stick, así no hay que tocar nada al encenderlo).
- Netlify solo sirve el sitio estático (ya no hay funciones serverless ni Netlify Blobs).

## 1. Desplegar con Netlify CLI (una sola vez la instalación)

```powershell
npm install -g netlify-cli
netlify login
```

Dentro de esta carpeta (`menu-la-barrita`):

```powershell
netlify link
```

`netlify link` te va a preguntar a qué sitio existente conectar esta carpeta — elige el sitio
donde ya tienes el sitio desplegado.

Luego, cada vez que quieras actualizar el sitio:

```powershell
netlify deploy --prod
```

## 2. Configurar Supabase (una sola vez)

1. En el proyecto de Supabase, corre en el **SQL Editor** el script que crea las tablas
   `menu_items` / `menu_settings`, el bucket `menu-photos` y sus políticas (RLS abierta, igual de
   accesible que el Admin sin login).
2. En Settings → API copia el **Project URL** y la **`anon` `public` key** (nunca la `service_role`
   ni ninguna `secret key` — esas nunca deben ir en el código del sitio).
3. En `index.html`, busca `SUPABASE_URL` y `SUPABASE_ANON_KEY` (al inicio del `<script>` principal)
   y pon ahí esos dos valores.

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
