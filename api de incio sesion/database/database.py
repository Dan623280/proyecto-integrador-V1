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

            print("====================================")
            print(" Conectado a PostgreSQL correctamente")
            print("====================================")

        except Error as e:
            print("Error al conectar:", e)

    def execute(self, query, params=None):
        try:
            self.cursor.execute(query, params)
            self.connection.commit()

        except Error as e:
            self.connection.rollback()
            print("Error:", e)

    def fetchone(self):
        return self.cursor.fetchone()

    def fetchall(self):
        return self.cursor.fetchall()

    def close(self):
        if self.cursor:
            self.cursor.close()

        if self.connection:
            self.connection.close()

            print("====================================")
            print(" Conexión cerrada")
            print("====================================")


database = Database()