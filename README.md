# Asignador Freelance con Gemini

Aplicación web que genera proyectos de práctica y evalúa entregas usando la API de Gemini. Cada usuario introduce su propia API key en el dashboard; la clave queda únicamente en `localStorage` del navegador y nunca se guarda en PostgreSQL.

## Requisitos

- Python 3.11 o superior
- PostgreSQL
- Una API key creada en [Google AI Studio](https://aistudio.google.com/app/apikey)

## 1. Crear la base de datos

En PostgreSQL crea una base llamada `proyecto_integrador` y ejecuta `database/schema.sql` dentro de ella.

## 2. Configurar y ejecutar el backend (PowerShell)

```powershell
cd backend
py -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Edita `backend/.env` y coloca los datos reales de PostgreSQL. Guarda el archivo con codificación **UTF-8** (en VS Code: clic en la codificación de la barra inferior → "Save with Encoding" → UTF-8). No escribas allí la API key del usuario.

```powershell
python run.py
```

La API quedará disponible en `http://127.0.0.1:8000`.

## 3. Ejecutar el frontend

Abre otra terminal en la carpeta raíz:

```powershell
py -m http.server 5500 --directory frontend
```

Visita `http://127.0.0.1:5500`, crea una cuenta, inicia sesión y pega tu API key de Gemini en el panel del dashboard.

En la entrega puedes seleccionar varios archivos de código a la vez. Se aceptan hasta 10 archivos, máximo 1 MB por archivo y 3 MB en total; Gemini los evalúa como una sola solución.

Las propuestas generadas no se guardan. Un proyecto se registra en PostgreSQL únicamente cuando el usuario lo acepta.

## Publicar en Render

El backend también sirve el frontend, por lo que ambos se publican con un único servicio web. Crea un repositorio privado en GitHub (sin subir `backend/.env`), crea una base Render Postgres y después un Web Service conectado al repositorio con:

```text
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

En las variables de entorno del servicio configura `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` con los datos de Render Postgres, además de `SECRET_KEY`, `GEMINI_MODEL=gemini-3.5-flash` y `ALLOWED_ORIGINS` con la URL pública del servicio. Ejecuta `database/schema.sql` una vez contra la base remota. La aplicación quedará disponible en la URL `onrender.com` del servicio.

## Seguridad de la API key

La clave se almacena solo en el navegador del usuario. Se envía mediante el encabezado `X-Gemini-API-Key` al backend y este la usa en memoria para consultar Gemini. Para borrarla, elimina los datos del sitio en el navegador.
