"""
Paquete de servicios.

Contiene la lógica de negocio del sistema,
como el registro e inicio de sesión de usuarios.
"""

from .auth_service import AuthService, auth_service
from .register_service import RegisterService, register_service

__all__ = [
    "AuthService",
    "auth_service",
    "RegisterService",
    "register_service"
]

__version__ = "1.0.0"