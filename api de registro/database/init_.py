"""
Paquete de base de datos.

Este paquete contiene la configuración y los métodos
para conectarse y trabajar con PostgreSQL.
"""

from .database import Database, database

__all__ = [
    "Database",
    "database"
]

__version__ = "1.0.0"