# Guía de Despliegue - Natuvital

Esta guía te ayudará a desplegar tu aplicación en producción.

## Opciones de Despliegue Recomendadas

### Opción 1: Vercel (Frontend) + Render (Backend) ⭐ RECOMENDADO

#### Frontend en Vercel (Gratis)

1. **Preparar el proyecto:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Subir a GitHub:**
   - Crea un repositorio en GitHub
   - Sube tu código (excepto node_modules y .env)

3. **Desplegar en Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu repositorio de GitHub
   - Configura:
     - **Framework Preset:** Vite
     - **Root Directory:** frontend
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
   - Agrega variable de entorno:
     - `VITE_API_URL` = `https://tu-backend-url.onrender.com/api`

#### Backend en Render (Gratis)

1. **Preparar el proyecto:**
   - Asegúrate de tener un archivo `.env` con todas las variables

2. **Desplegar en Render:**
   - Ve a [render.com](https://render.com)
   - Crea una nueva "Web Service"
   - Conecta tu repositorio de GitHub
   - Configura:
     - **Name:** natuvital-backend
     - **Environment:** Node
     - **Build Command:** `cd backend && npm install`
     - **Start Command:** `cd backend && npm start`
     - **Root Directory:** (deja vacío o pon `backend`)
   - Agrega variables de entorno:
     - `MONGODB_URI` = tu connection string de MongoDB Atlas
     - `JWT_SECRET` = una clave secreta aleatoria
     - `ADMIN_EMAIL` = tu email de admin
     - `ADMIN_PASSWORD` = tu contraseña
     - `ADMIN_PASSWORD_HASH` = el hash generado con `npm run seed`
     - `ALLOWED_ORIGINS` = `https://tu-frontend.vercel.app` (la URL que te dé Vercel)

3. **Obtener la URL del backend:**
   - Render te dará una URL como: `https://natuvital-backend.onrender.com`
   - Actualiza `VITE_API_URL` en Vercel con: `https://natuvital-backend.onrender.com/api`

---

### Opción 2: Netlify (Frontend) + Railway (Backend)

#### Frontend en Netlify

1. **Subir a GitHub** (igual que arriba)

2. **Desplegar en Netlify:**
   - Ve a [netlify.com](https://netlify.com)
   - "Add new site" → "Import an existing project"
   - Conecta tu repositorio
   - Configura:
     - **Base directory:** `frontend`
     - **Build command:** `npm run build`
     - **Publish directory:** `frontend/dist`
   - Agrega variable de entorno:
     - `VITE_API_URL` = `https://tu-backend.railway.app/api`

#### Backend en Railway

1. **Desplegar en Railway:**
   - Ve a [railway.app](https://railway.app)
   - "New Project" → "Deploy from GitHub repo"
   - Selecciona tu repositorio
   - Configura:
     - **Root Directory:** `backend`
     - **Start Command:** `npm start`
   - Agrega variables de entorno (igual que Render)

---

## Pasos Importantes

### 1. Configurar MongoDB Atlas

Asegúrate de que en MongoDB Atlas:
- **Network Access:** Agrega `0.0.0.0/0` para permitir desde cualquier IP
- **Database Access:** Usuario y contraseña configurados

### 2. Variables de Entorno

**Frontend (.env o en la plataforma):**
```
VITE_API_URL=https://tu-backend-url.com/api
```

**Backend (.env o en la plataforma):**
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=clave_secreta_muy_larga
ADMIN_EMAIL=admin@natuvital.com
ADMIN_PASSWORD=tu_password
ADMIN_PASSWORD_HASH=hash_generado
ALLOWED_ORIGINS=https://tu-frontend.vercel.app
```

### 3. Generar Hash de Contraseña

En local, ejecuta:
```bash
cd backend
npm run seed
```

Copia el hash que aparece y úsalo en `ADMIN_PASSWORD_HASH`.

### 4. Actualizar CORS

Después de desplegar el frontend, actualiza `ALLOWED_ORIGINS` en el backend con la URL real del frontend.

---

## Verificación Post-Despliegue

1. ✅ El frontend carga correctamente
2. ✅ Puedes hacer login con tus credenciales
3. ✅ Puedes ver la lista de productos
4. ✅ Puedes crear, editar y eliminar productos
5. ✅ No hay errores en la consola del navegador

---

## Solución de Problemas

### Error: "No permitido por CORS"
- Verifica que `ALLOWED_ORIGINS` incluya la URL exacta del frontend (con https://)

### Error: "Cannot connect to server"
- Verifica que `VITE_API_URL` apunte a la URL correcta del backend
- Asegúrate de que el backend esté corriendo

### Error: "MongoDB connection failed"
- Verifica que `MONGODB_URI` sea correcta
- Verifica que MongoDB Atlas permita conexiones desde cualquier IP

---

## URLs de Ejemplo

Después del despliegue tendrás algo como:
- **Frontend:** `https://natuvital.vercel.app`
- **Backend:** `https://natuvital-backend.onrender.com`

¡Listo! Tu aplicación estará disponible públicamente. 🌿

