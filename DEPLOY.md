# Desplegar Marea Tours en Railway 🚂

Guía paso a paso para poner el sitio en vivo con base de datos y panel de admin.

## 1. Crea el proyecto

1. Entra a [railway.app](https://railway.app) e inicia sesión con GitHub.
2. **New Project → Deploy from GitHub repo** y elige `dealsale/app`.
3. En **Settings → Source**, selecciona la rama `claude/a-mar-tour-booking-page-bu1th9`
   (o `main` si ya la fusionaste).

## 2. Agrega la base de datos PostgreSQL

1. Dentro del proyecto: **New → Database → Add PostgreSQL**.
2. Railway crea la base y expone la variable `DATABASE_URL` automáticamente.
3. Ve al servicio de la **app** → pestaña **Variables** → **New Variable Reference**
   y enlaza `DATABASE_URL` desde el Postgres (o usa `${{Postgres.DATABASE_URL}}`).

## 3. Configura las variables de entorno

En el servicio de la app, pestaña **Variables**, agrega:

| Variable | Valor |
|---|---|
| `DATABASE_URL` | (referencia al Postgres, ver paso 2) |
| `ADMIN_PASSWORD` | la contraseña que quieras para `/admin` |
| `SESSION_SECRET` | una cadena larga y aleatoria |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | tu WhatsApp con indicativo, solo dígitos (ej. `573001234567`) |

> Genera un `SESSION_SECRET` rápido con: `openssl rand -hex 32`

## 4. Deploy

- Railway construye con `npm run build` y arranca con `npm run start`.
- El arranque ejecuta automáticamente **`prisma migrate deploy`** (crea las tablas)
  y **siembra los 6 tours** de ejemplo (idempotente).
- Cuando termine, en **Settings → Networking → Generate Domain** obtienes tu URL pública.

## 5. Listo ✅

- Sitio público: la URL que generó Railway.
- Panel de admin: `TU-URL/admin` (entra con `ADMIN_PASSWORD`).

---

### Notas

- El seed usa `upsert`, así que puedes reiniciar sin duplicar tours. Edita todo desde
  el panel de admin o en `prisma/seed.mjs`.
- Para un dominio propio: **Settings → Networking → Custom Domain** y apunta el CNAME.
- ¿Prefieres otra plataforma? Cualquier host de Node/Next.js con Postgres sirve
  (Render, Fly.io, VPS). Solo necesita las mismas 4 variables de entorno.
