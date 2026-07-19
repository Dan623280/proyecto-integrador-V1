python -m venv venv

venv\Scripts\Activate.ps1

python -m pip install "fastapi[standard]" psycopg2-binary python-dotenv bcrypt

activa el entorno
fastapi dev app.py