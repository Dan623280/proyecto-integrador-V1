class Usuario:
    """
    Modelo de Usuario
    """

    def __init__(self, id=None, nombre="", email="", password=""):
        self.id = id
        self.nombre = nombre
        self.email = email
        self.password = password

    # ==========================
    # GETTERS
    # ==========================

    def get_id(self):
        return self.id

    def get_nombre(self):
        return self.nombre

    def get_email(self):
        return self.email

    def get_password(self):
        return self.password

    # ==========================
    # SETTERS
    # ==========================

    def set_id(self, id):
        self.id = id

    def set_nombre(self, nombre):
        self.nombre = nombre

    def set_email(self, email):
        self.email = email

    def set_password(self, password):
        self.password = password

    # ==========================
    # CONVERTIR A DICCIONARIO
    # ==========================

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "email": self.email
        }

    # ==========================
    # CREAR DESDE LA BASE DE DATOS
    # ==========================

    @classmethod
    def from_db(cls, fila):
        if fila is None:
            return None

        return cls(
            id=fila[0],
            nombre=fila[1],
            email=fila[2],
            password=fila[3]
        )

    # ==========================
    # REPRESENTACIÓN DEL OBJETO
    # ==========================

    def __str__(self):
        return (
            f"Usuario(\n"
            f"  ID={self.id},\n"
            f"  Nombre='{self.nombre}',\n"
            f"  Email='{self.email}'\n"
            f")"
        )

    def __repr__(self):
        return self.__str__()