export const proyectosDB = {
    Junior: [
        {
            nombre: 'Calculadora de Propinas Interactiva',

            descripcion:
                'Aplicación para calcular propinas según el costo de la cuenta y el nivel de satisfacción.',

            requisitos: [
                'Crear una interfaz con campos numéricos.',
                'Calcular la propina sin recargar la página.',
                'Mostrar el total y el valor por persona.'
            ],

            archivos: [
                'index.html',
                'style.css',
                'app.js'
            ]
        },

        {
            nombre: 'Lista de Tareas Inteligente',

            descripcion:
                'Aplicación para crear, completar, eliminar y filtrar tareas.',

            requisitos: [
                'Permitir crear y eliminar tareas.',
                'Marcar tareas como completadas.',
                'Guardar las tareas en localStorage.'
            ],

            archivos: [
                'index.html',
                'style.css',
                'todo.js'
            ]
        },

        {
            nombre: 'Conversor de Divisas',

            descripcion:
                'Herramienta para convertir cantidades entre diferentes monedas.',

            requisitos: [
                'Permitir ingresar una cantidad.',
                'Seleccionar moneda de origen y destino.',
                'Mostrar el resultado automáticamente.'
            ],

            archivos: [
                'index.html',
                'style.css',
                'converter.js'
            ]
        }
    ],

    'Semi Senior': [
        {
            nombre:
                'Dashboard de Inventario con Alertas',

            descripcion:
                'Panel para administrar productos y detectar niveles bajos de inventario.',

            requisitos: [
                'Mostrar los productos en un dashboard.',
                'Crear alertas cuando el stock sea menor a cinco.',
                'Permitir buscar y filtrar productos.'
            ],

            archivos: [
                'dashboard.html',
                'inventory.js',
                'alerts.css',
                'products.json'
            ]
        },

        {
            nombre:
                'Plataforma de Reserva de Espacios',

            descripcion:
                'Sistema para reservar espacios y consultar su disponibilidad.',

            requisitos: [
                'Mostrar los espacios disponibles.',
                'Evitar reservas duplicadas.',
                'Guardar el historial de reservas.'
            ],

            archivos: [
                'dashboard.html',
                'booking.js',
                'layout.css',
                'spaces.json'
            ]
        },

        {
            nombre: 'Gestor Kanban',

            descripcion:
                'Tablero para administrar tareas mediante columnas de progreso.',

            requisitos: [
                'Crear columnas de estados.',
                'Permitir mover las tareas.',
                'Agregar prioridades y etiquetas.'
            ],

            archivos: [
                'kanban.html',
                'drag-drop.js',
                'theme.css',
                'data.json'
            ]
        }
    ],

    Senior: [
        {
            nombre:
                'Portal de Monitoreo de Microservicios',

            descripcion:
                'Sistema para observar el estado y rendimiento de varios servicios.',

            requisitos: [
                'Mostrar logs y alertas.',
                'Permitir reiniciar servicios.',
                'Mostrar métricas de latencia.'
            ],

            archivos: [
                'server.js',
                'monitor.py',
                'docker-compose.yml',
                'metrics.go'
            ]
        },

        {
            nombre:
                'Orquestador de Pipelines CI/CD',

            descripcion:
                'Sistema para visualizar y controlar procesos automatizados de despliegue.',

            requisitos: [
                'Mostrar logs en tiempo real.',
                'Permitir pausar y reintentar procesos.',
                'Leer la configuración desde YAML.'
            ],

            archivos: [
                'pipeline.js',
                'runner.sh',
                'pipeline.yaml',
                'config.json'
            ]
        },

        {
            nombre:
                'Simulador de Trading de Criptomonedas',

            descripcion:
                'Simulador para registrar operaciones y calcular el valor de un portafolio.',

            requisitos: [
                'Simular cambios de precios.',
                'Registrar compras y ventas.',
                'Calcular el balance del usuario.'
            ],

            archivos: [
                'trading.js',
                'market.py',
                'portfolio.js',
                'prices.json'
            ]
        }
    ]
};