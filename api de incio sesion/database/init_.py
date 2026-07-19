import psycopg2
from psycopg2 import Error

# ==========================================
# CONFIGURACIÓN DE LA BASE DE DATOS
# ==========================================

HOST = "localhost"
PORT = "5558"
DATABASE = "daniel"
USER = "daniel"
PASSWORD = "daniel123"


# ==========================================
# CONEXIÓN A POSTGRESQL
# ==========================================

def conectar():
    """
    Establece la conexión con PostgreSQL.
    """
    try:
        conexion = psycopg2.connect(
            host=HOST,
            port=PORT,
            database=DATABASE,
            user=USER,
            password=PASSWORD
        )

        print("✅ Conexión establecida correctamente.")
        return conexion

    except Error as error:
        print("❌ Error al conectar a PostgreSQL:")
        print(error)
        return None


# ==========================================
# OBTENER CURSOR
# ==========================================

def obtener_cursor(conexion):
    """
    Devuelve un cursor para ejecutar consultas SQL.
    """
    if conexion:
        return conexion.cursor()
    return None


# ==========================================
# GUARDAR CAMBIOS
# ==========================================

def guardar(conexion):
    """
    Guarda los cambios realizados en la base de datos.
    """
    if conexion:
        conexion.commit()


# ==========================================
# CANCELAR CAMBIOS
# ==========================================

def cancelar(conexion):
    """
    Revierte los cambios si ocurre un error.
    """
    if conexion:
        conexion.rollback()


# ==========================================
# CERRAR CURSOR
# ==========================================

def cerrar_cursor(cursor):
    """
    Cierra el cursor.
    """
    if cursor:
        cursor.close()


# ==========================================
# CERRAR CONEXIÓN
# ==========================================

def cerrar_conexion(conexion):
    """
    Cierra la conexión con PostgreSQL.
    """
    if conexion:
        conexion.close()
        print("🔒 Conexión cerrada correctamente.")


# ==========================================
# PROBAR LA CONEXIÓN
# ==========================================

if __name__ == "__main__":
    conexion = conectar()

    if conexion:
        cursor = obtener_cursor(conexion)

        cursor.execute("SELECT version();")
        version = cursor.fetchone()

        print("\n===== PostgreSQL =====")
        print(version[0])

        cerrar_cursor(cursor)
        cerrar_conexion(conexion)