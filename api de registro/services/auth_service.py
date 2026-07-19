from database import database
from models import usuarios


class AuthService:

    def iniciar_sesion(self, email, password):
        try:
            database.connect()

            query = """
                SELECT id, nombre, email, password
                FROM usuarios
                WHERE email = %s;
            """

            database.execute(query, (email,))

            resultado = database.fetchone()

            if resultado is None:
                return {
                    "success": False,
                    "message": "El usuario no existe."
                }

            usuario = usuarios.from_db(resultado)

            if usuario.password != password:
                return {
                    "success": False,
                    "message": "Contraseña incorrecta."
                }

            return {
                "success": True,
                "message": "Inicio de sesión exitoso.",
                "usuario": usuario.to_dict()
            }

        except Exception as error:
            return {
                "success": False,
                "message": str(error)
            }

        finally:
            database.close()

    def buscar_por_email(self, email):
        try:
            database.connect()

            query = """
                SELECT id, nombre, email, password
                FROM usuarios
                WHERE email = %s;
            """

            database.execute(query, (email,))

            resultado = database.fetchone()

            if resultado:
                return usuarios.from_db(resultado)

            return None

        except Exception:
            return None

        finally:
            database.close()


auth_service = AuthService()