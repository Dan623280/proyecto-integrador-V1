Sistema de Registro e Inicio de Sesión

Descripción

Este proyecto consiste en un sistema de autenticación desarrollado en Python con conexión a una base de datos PostgreSQL.

Permite crear cuentas de usuario e iniciar sesión verificando las credenciales almacenadas en la base de datos.

El proyecto está organizado por módulos para facilitar su mantenimiento, reutilización e integración con aplicaciones más grandes.

---

Objetivos

- Implementar un sistema de registro de usuarios.
- Implementar un sistema de inicio de sesión.
- Conectar Python con PostgreSQL.
- Organizar el código utilizando una arquitectura por capas.
- Facilitar la integración del sistema con otros proyectos.

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
│   ├── __init__.py
│   └── database.py
│
├── models/
│   ├── __init__.py
│   └── usuario.py
│
├── services/
│   ├── __init__.py
│   ├── auth_service.py
│   └── register_service.py
│
└── sql/
    └── schema.sql

---

Funcionalidades

- Crear una cuenta de usuario.
- Validar que el correo no esté registrado.
- Iniciar sesión con correo y contraseña.
- Consultar usuarios almacenados en PostgreSQL.
- Organización del proyecto por módulos.

---

Base de datos

El proyecto utiliza PostgreSQL.

Tabla principal:

usuarios

Campos:

- id
- nombre
- email
- password
- created_at
- updated_at

---

Instalación

1. Instalar Python 3

Verificar la instalación:

python --version

---

2. Instalar las dependencias

pip install -r requirements.txt

---

3. Crear la base de datos

Ejecutar el archivo:

sql/schema.sql

desde PostgreSQL o DataGrip.

---

4. Configurar la conexión

Editar el archivo:

database/database.py

y configurar:

- Host
- Puerto
- Base de datos
- Usuario
- Contraseña

---

5. Ejecutar la aplicación

python app.py

---

Flujo del sistema

Registro

1. El usuario ingresa su nombre.
2. Ingresa su correo electrónico.
3. Ingresa una contraseña.
4. El sistema verifica si el correo ya existe.
5. Si el correo no existe, crea la cuenta y guarda la información en PostgreSQL.

---

Inicio de sesión

1. El usuario ingresa su correo.
2. Ingresa su contraseña.
3. El sistema busca el usuario en PostgreSQL.
4. Se comparan las credenciales.
5. Si son correctas, el acceso es concedido.
6. Si son incorrectas, el sistema muestra un mensaje de error.

---

Organización del proyecto

database

Gestiona la conexión con PostgreSQL y la ejecución de consultas.

models

Contiene las clases que representan las entidades de la aplicación.

services

Implementa la lógica de negocio para el registro y la autenticación de usuarios.

sql

Incluye los scripts SQL para crear la estructura de la base de datos.

---

Posibles mejoras

- Cifrar contraseñas con bcrypt.
- Recuperación de contraseña.
- Edición del perfil.
- Eliminación de cuentas.
- Autenticación mediante JWT.
- Registro de fecha del último inicio de sesión.

---

Autor

Erick Demoya

---

Licencia

Proyecto desarrollado con fines educativos y de aprendizaje.