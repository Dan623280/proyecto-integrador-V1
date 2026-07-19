from database import database
from models import usuarios


class RegisterService:

    def registrar_usuario(self, nombre, email, password):
        try:
            database.connect()

            # Verificar si el correo ya existe
            query = """
                SELECT id
                FROM usuarios
                WHERE email = %s;
            """

            database.execute(query, (email,))

            if database.fetchone():
                return {
                    "success": False,
                    "message": "El correo ya está registrado."
                }

            # Registrar el usuario
            query = """
                INSERT INTO usuarios (nombre, email, password)
                VALUES (%s, %s, %s);
            """

            database.execute(query, (nombre, email, password))
            database.commit()

            return {
                "success": True,
                "message": "Cuenta creada correctamente."
            }

        except Exception as error:
            database.rollback()

            return {
                "success": False,
                "message": str(error)
            }

        finally:
            database.close()

    def listar_usuarios(self):
        try:
            database.connect()

            query = """
                SELECT id, nombre, email, password
                FROM usuarios
                ORDER BY id;
            """

            database.execute(query)

            usuarios = []

            for fila in database.fetchall():
                usuarios.append(usuarios.from_db(fila))

            return usuarios

        except Exception:
            return []

        finally:
            database.close()


register_service = RegisterService()