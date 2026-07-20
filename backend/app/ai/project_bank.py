PROJECTS = {
    "Junior": [
        {
            "nombre": "Sistema de Gestión de Contactos",
            "descripcion": "Aplicación de consola para registrar, buscar y listar contactos usando JSON.",
            "duracion_estimada": "3 horas",
            "objetivo": "Practicar diccionarios, ciclos, condicionales y persistencia JSON.",
            "requisitos": [
                "Agregar contactos con nombre y teléfono.",
                "Buscar contactos por nombre.",
                "Listar todos los contactos.",
                "Guardar y cargar los datos desde agenda.json."
            ],
            "archivos": ["main.py", "agenda.json"]
        }
    ],
    "Semi Senior": [
        {
            "nombre": "Plataforma de Inventario para Tienda de Ropa",
            "descripcion": "Sistema con POO para administrar productos, stock y ventas.",
            "duracion_estimada": "7 horas",
            "objetivo": "Aplicar clases, métodos, excepciones y persistencia estructurada.",
            "requisitos": [
                "Crear una clase Producto con ID, nombre, precio, cantidad y categoría.",
                "Registrar productos.",
                "Actualizar el stock.",
                "Buscar por categoría o rango de precio.",
                "Realizar ventas restando unidades del stock.",
                "Guardar los datos en un archivo JSON."
            ],
            "archivos": ["main.py", "inventario.json"]
        }
    ],
    "Senior": [
        {
            "nombre": "Simulador de Transacciones Bancarias",
            "descripcion": "Sistema bancario de consola con herencia, autenticación y auditoría.",
            "duracion_estimada": "15 horas",
            "objetivo": "Aplicar herencia, polimorfismo, excepciones y persistencia compleja.",
            "requisitos": [
                "Crear CuentaBancaria y subclases CuentaAhorro y CuentaCorriente.",
                "Implementar autenticación con número de cuenta y PIN.",
                "Permitir consignaciones, retiros y transferencias.",
                "Validar saldo y límites de operación.",
                "Guardar movimientos y auditoría en JSON.",
                "Aplicar manejo de excepciones y buenas prácticas."
            ],
            "archivos": ["main.py", "cuentas.json", "auditoria.json"]
        }
    ]
}
