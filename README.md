python -m venv venv

venv\Scripts\Activate.ps1

python -m pip install "fastapi[standard]" psycopg2-binary python-dotenv bcrypt


Activar entorno
venv\Scripts\Activate.ps1



abrir servidor de dev app.py
fastapi dev app.py

desactivar el servidor
deactivate