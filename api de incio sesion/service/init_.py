"""
Paquete de servicios.

Contiene la lógica de negocio de la aplicación.
"""

from .auth_service import auth_service, AuthService

__all__ = ["auth_service", "AuthService"]

__version__ = "1.0.0"