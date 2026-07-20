import bcrypt
from fastapi import APIRouter
from pydantic import BaseModel, EmailStr, Field
from psycopg2.errors import UniqueViolation

from app.database import obtener_conexion


router = APIRouter(
    tags=["Autenticación"]
)


class RegistroRequest(BaseModel):
    nombre: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)


@router.post("/registro")
def registrar_usuario(datos: RegistroRequest):
    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()

        email = datos.email.lower().strip()

        cursor.execute(
            """
            SELECT id
            FROM usuarios
            WHERE email = %s;
            """,
            (email,)
        )

        if cursor.fetchone():
            return {
                "success": False,
                "message": "El correo ya está registrado."
            }

        password_hash = bcrypt.hashpw(
            datos.password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        cursor.execute(
            """
            INSERT INTO usuarios (
                nombre,
                email,
                password_hash
            )
            VALUES (%s, %s, %s)
            RETURNING id, nombre, email;
            """,
            (
                datos.nombre.strip(),
                email,
                password_hash
            )
        )

        usuario = cursor.fetchone()

        conexion.commit()

        return {
            "success": True,
            "message": "Cuenta creada correctamente.",
            "usuario": {
                "id": usuario[0],
                "nombre": usuario[1],
                "email": usuario[2]
            }
        }

    except UniqueViolation:
        if conexion:
            conexion.rollback()

        return {
            "success": False,
            "message": "El correo ya está registrado."
        }

    except Exception as error:
        if conexion:
            conexion.rollback()

        print(f"Error al registrar usuario: {error}")

        return {
            "success": False,
            "message": "No fue posible registrar el usuario."
        }

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()


@router.post("/login")
def iniciar_sesion(datos: LoginRequest):
    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()

        email = datos.email.lower().strip()

        cursor.execute(
            """
            SELECT
                id,
                nombre,
                email,
                password_hash
            FROM usuarios
            WHERE email = %s;
            """,
            (email,)
        )

        usuario = cursor.fetchone()

        if usuario is None:
            return {
                "success": False,
                "message": "El correo o la contraseña son incorrectos."
            }

        password_correcta = bcrypt.checkpw(
            datos.password.encode("utf-8"),
            usuario[3].encode("utf-8")
        )

        if not password_correcta:
            return {
                "success": False,
                "message": "El correo o la contraseña son incorrectos."
            }

        return {
            "success": True,
            "message": "Inicio de sesión exitoso.",
            "usuario": {
                "id": usuario[0],
                "nombre": usuario[1],
                "email": usuario[2]
            }
        }

    except Exception as error:
        print(f"Error al iniciar sesión: {error}")

        return {
            "success": False,
            "message": "No fue posible iniciar sesión."
        }

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()