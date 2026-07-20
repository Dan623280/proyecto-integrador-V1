"""Conexión única a PostgreSQL, configurada exclusivamente desde .env."""

import os

import psycopg2
from dotenv import load_dotenv


load_dotenv()


def obtener_conexion():
    # Cada endpoint cierra su propia conexión en un bloque finally.
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD")
    )
