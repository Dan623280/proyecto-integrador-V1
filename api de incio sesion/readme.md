API de Inicio de Sesión

Descripción

Este proyecto implementa un sistema de inicio de sesión desarrollado en Python con conexión a una base de datos PostgreSQL.

Su objetivo es validar las credenciales de un usuario mediante correo electrónico y contraseña, consultando la información almacenada en la base de datos.

El proyecto está organizado por módulos para facilitar su mantenimiento e integración con otros sistemas.

---

Tecnologías utilizadas

- Python 3
- PostgreSQL
- psycopg2
- DataGrip

---

Estructura del proyecto

login_api/
│
├── app.py
├── requirements.txt
├── README.md
│
├── database/
│ ├── **init**.py
│ └── database.py
│
├── models/
│ ├── **init**.py
│ └── usuario.py
│
├── services/
│ ├── **init**.py
│ └── auth_service.py
│
└── sql/
└── schema.sql

---

Funcionalidades

- Conexión a PostgreSQL.
- Validación de usuarios.
- Verificación de correo electrónico.
- Verificación de contraseña.
- Organización del proyecto por módulos.

---

Base de datos

La información de los usuarios se almacena en la tabla "usuarios", la cual contiene los siguientes campos:

- id
- nombre
- email
- password

---

Instalación

1. Instalar Python 3.
2. Instalar las dependencias:

pip install -r requirements.txt

3. Ejecutar el archivo "schema.sql" para crear la tabla en PostgreSQL.

4. Configurar la conexión en "database/database.py".

5. Ejecutar el archivo principal:

python app.py

---

Integración

Este proyecto fue desarrollado para servir como módulo de autenticación y puede integrarse fácilmente en aplicaciones web, móviles o de escritorio que necesiten validar usuarios mediante una base de datos PostgreSQL.

---

Autor

Erick Demoya

---

Licencia

Proyecto desarrollado con fines educativos y de aprendizaje.
