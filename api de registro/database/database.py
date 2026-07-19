import psycopg2
from psycopg2 import Error


class Database:

    def __init__(self):
        self.host = "localhost"
        self.port = "5558"
        self.database = "daniel"
        self.user = "daniel"
        self.password = "daniel123"

        self.connection = None
        self.cursor = None

    # ==============================
    # CONECTAR A POSTGRESQL
    # ==============================

    def connect(self):
        try:
            self.connection = psycopg2.connect(
                host=self.host,
                port=self.port,
                database=self.database,
                user=self.user,
                password=self.password
            )

            self.cursor = self.connection.cursor()

            print("========================================")
            print(" Conexión establecida correctamente")
            print("========================================")

        except Error as error:
            print("Error al conectar a PostgreSQL")
            print(error)

    # ==============================
    # EJECUTAR CONSULTAS
    # ==============================

    def execute(self, query, params=None):
        try:
            self.cursor.execute(query, params)

        except Error as error:
            print("Error al ejecutar la consulta")
            print(error)

    # ==============================
    # INSERTAR / ACTUALIZAR / ELIMINAR
    # ==============================

    def commit(self):
        try:
            self.connection.commit()

        except Error as error:
            print(error)

    # ==============================
    # CANCELAR CAMBIOS
    # ==============================

    def rollback(self):
        try:
            self.connection.rollback()

        except Error as error:
            print(error)

    # ==============================
    # OBTENER UN REGISTRO
    # ==============================

    def fetchone(self):
        return self.cursor.fetchone()

    # ==============================
    # OBTENER TODOS LOS REGISTROS
    # ==============================

    def fetchall(self):
        return self.cursor.fetchall()

    # ==============================
    # CERRAR CURSOR
    # ==============================

    def close_cursor(self):
        if self.cursor:
            self.cursor.close()

    # ==============================
    # CERRAR CONEXIÓN
    # ==============================

    def close(self):
        if self.cursor:
            self.cursor.close()

        if self.connection:
            self.connection.close()

            print("========================================")
            print(" Conexión cerrada correctamente")
            print("========================================")


database = Database()