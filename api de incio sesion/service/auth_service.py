from database.database import database
from models import usuarios


class AuthService:

    def login(self, email, password):
        """
        Verifica las credenciales del usuario.
        """

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
                "usuario": {
                    "id": usuario.id,
                    "nombre": usuario.nombre,
                    "email": usuario.email
                }
            }

        except Exception as error:
            return {
                "success": False,
                "message": f"Error: {error}"
            }

        finally:
            database.close()

    def buscar_usuario(self, email):
        """
        Busca un usuario por correo electrónico.
        """

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

        except Exception as error:
            print(error)
            return None

        finally:
            database.close()


auth_service = AuthService()