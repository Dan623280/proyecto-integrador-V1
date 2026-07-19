document.addEventListener('DOMContentLoaded', () => {
    // Verificación de autenticación
    const user = JSON.parse(localStorage.getItem('freelancer_user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Actualizar nombre de desarrollador y avatares en la UI
    const devName = document.getElementById('devName');
    const devAvatar = document.getElementById('devAvatar');
    const userAvatar = document.getElementById('userAvatar');
    const headerUserName = document.getElementById('headerUserName');
    
    if (devName && user.name) {
        devName.innerText = user.name;
    }
    if (headerUserName && user.name) {
        headerUserName.innerText = user.name;
    }
    if (user.name) {
        const initial = user.name.charAt(0).toUpperCase();
        if (userAvatar) {
            userAvatar.innerText = initial;
            userAvatar.title = user.name;
        }
    }

    // Lógica para cerrar sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: '¿Cerrar sesión?',
                    text: '¿Estás seguro de que deseas salir de tu cuenta?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, salir',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        localStorage.removeItem('freelancer_user');
                        Swal.fire({
                            title: '¡Sesión cerrada!',
                            text: 'Has salido correctamente.',
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false,
                            allowOutsideClick: false
                        }).then(() => {
                            window.location.href = 'index.html';
                        });
                    }
                });
            } else {
                if (confirm('¿Estás seguro de que deseas salir?')) {
                    localStorage.removeItem('freelancer_user');
                    window.location.href = 'index.html';
                }
            }
        });
    }

    // Base de datos de proyectos por dificultad
    const proyectosDB = {
        "Junior": [
            {
                nombre: "Calculadora de Propinas Interactiva",
                descripcion: "Una aplicación sencilla para calcular propinas basada en el costo total de la cuenta y el nivel de satisfacción del servicio.",
                requisitos: [
                    "Crear una interfaz limpia y amigable con inputs numéricos.",
                    "Calcular la propina en tiempo real sin recargar la página.",
                    "Mostrar el total a pagar y el desglose por persona de forma clara."
                ],
                archivos: ["index.html", "style.css", "app.js"]
            },
            {
                nombre: "Lista de Tareas Inteligente (To-Do List)",
                descripcion: "Una aplicación para gestionar tareas pendientes, permitiendo filtrar por completadas y guardar los datos localmente.",
                requisitos: [
                    "Diseñar una lista interactiva con checkboxes y animaciones de completado.",
                    "Guardar las tareas en localStorage para persistencia entre sesiones.",
                    "Filtros rápidos para alternar entre tareas pendientes y completadas."
                ],
                archivos: ["index.html", "style.css", "todo.js"]
            },
            {
                nombre: "Conversor de Divisas en Tiempo Real",
                descripcion: "Una herramienta sencilla para convertir monedas utilizando tipos de cambio fijos o simulados en tiempo real.",
                requisitos: [
                    "Inputs para cantidad y selectores de moneda origen/destino con banderas.",
                    "Cálculo instantáneo al escribir o cambiar la moneda sin demoras.",
                    "Diseño completamente responsivo optimizado para dispositivos móviles."
                ],
                archivos: ["index.html", "style.css", "converter.js"]
            }
        ],
        "Semi Senior": [
            {
                nombre: "Dashboard de Inventario con Alertas de Stock",
                descripcion: "Un panel de control interactivo para gestionar productos, con notificaciones y alertas automáticas cuando el stock sea crítico.",
                requisitos: [
                    "Crear la estructura del Dashboard a 2 columnas con CSS Grid/Flexbox.",
                    "Implementar alertas visuales interactivas cuando el stock sea menor a 5 unidades.",
                    "Permitir filtrar los productos en tiempo real por su nombre o categoría."
                ],
                archivos: ["dashboard.html", "inventory.js", "alerts.css", "products.json"]
            },
            {
                nombre: "Plataforma de Reserva de Espacios (Coworking)",
                descripcion: "Un sistema de reservas interactivo con mapa de asientos/escritorios y control de horarios en tiempo real.",
                requisitos: [
                    "Mapa visual interactivo de asientos disponibles en el espacio de trabajo.",
                    "Reglas de negocio para evitar doble reserva en el mismo bloque horario.",
                    "Historial de reservas del usuario persistido en base de datos local."
                ],
                archivos: ["dashboard.html", "booking.js", "layout.css", "spaces.json"]
            },
            {
                nombre: "Gestor de Tareas Kanban Personalizado",
                descripcion: "Un tablero Kanban estilo Trello con columnas de progreso y movimiento interactivo de tarjetas.",
                requisitos: [
                    "Columnas dinámicas de progreso (Por hacer, En progreso, Completado).",
                    "Capacidad de mover/arrastrar tareas entre columnas de forma interactiva.",
                    "Formulario modal para añadir subtareas y etiquetas de prioridad de color."
                ],
                archivos: ["kanban.html", "drag-drop.js", "theme.css", "data.json"]
            }
        ],
        "Senior": [
            {
                nombre: "Portal de Monitoreo de Microservicios y Latencia",
                descripcion: "Un sistema avanzado de monitorización que muestra en tiempo real el estado de múltiples servidores y sus métricas de rendimiento.",
                requisitos: [
                    "Simular logs y alertas en vivo con diferentes niveles de severidad.",
                    "Implementar un botón interactivo para reiniciar servicios caídos y actualizar su estado.",
                    "Mostrar gráficas simuladas y calcular promedios de latencia dinámicamente."
                ],
                archivos: ["server.js", "monitor.py", "docker-compose.yml", "metrics.go", "dashboard-config.json"]
            },
            {
                nombre: "Orquestador de Pipelines CI/CD con Logs en Vivo",
                descripcion: "Un visualizador avanzado de flujos de despliegue automatizados con logs simulados y control de ejecuciones concurrentes.",
                requisitos: [
                    "Simulación de logs de compilación detallados y auto-scroll en tiempo real.",
                    "Botonera para detener, pausar o reintentar pasos del pipeline fallidos.",
                    "Configuración modular del pipeline leída desde un archivo YAML estructurado."
                ],
                archivos: ["pipeline.js", "runner.sh", "pipeline.yaml", "logs-socket.go", "config.json"]
            },
            {
                nombre: "Plataforma de Trading de Criptomonedas (Simulador)",
                descripcion: "Un simulador financiero de alta fidelidad con gráficas de velas en tiempo real, órdenes de compra/venta y libro de órdenes.",
                requisitos: [
                    "Visualización interactiva de fluctuaciones de precios mediante WebSocket simulado.",
                    "Ejecución y registro de órdenes límite y de mercado en tiempo real.",
                    "Cálculo automático del valor del portafolio y balance actual de fondos."
                ],
                archivos: ["trading.js", "market.py", "portfolio.go", "docker-compose.yml", "prices.json"]
            }
        ]
    };

    // Selección de elementos del DOM
    const difficultyCards = document.querySelectorAll('.option-card');
    const btnPedir = document.getElementById('btn-pedir');
    const btnAceptar = document.getElementById('btn-aceptar');
    const btnRechazar = document.getElementById('btn-rechazar');
    const btnEntregar = document.getElementById('btn-entregar');
    const chatBox = document.getElementById('chat-box');
    const steps = document.querySelectorAll('.step');

    // Elementos de la sección de entrega de archivos
    const fileDeliveryContainer = document.getElementById('file-delivery-container');
    const fileSearchInput = document.getElementById('file-search-input');
    const searchSuggestions = document.getElementById('search-suggestions');
    const btnUploadTrigger = document.getElementById('btn-upload-trigger');
    const realFileInput = document.getElementById('real-file-input');
    const selectedFileBadge = document.getElementById('selected-file-badge');
    const selectedFileName = document.getElementById('selected-file-name');
    const btnRemoveFile = document.getElementById('btn-remove-file');

    let dificultadActiva = "Semi Senior"; // Valor predeterminado
    let proyectoActual = null;
    let archivoSeleccionado = null;

    // Lógica para cambiar de dificultad
    difficultyCards.forEach(card => {
        card.addEventListener('click', () => {
            // Solo permitir cambiar dificultad si no hay un proyecto en curso aceptado
            if (btnAceptar.disabled && btnRechazar.disabled && !btnPedir.disabled) {
                difficultyCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                dificultadActiva = card.querySelector('strong').innerText;
            }
        });
    });

    // Función auxiliar para scroll automático del chat
    const scrollChat = () => {
        chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
    };

    // Funciones auxiliares para entrega de archivos
    const selectFile = (name) => {
        archivoSeleccionado = name;
        if (selectedFileName) selectedFileName.innerText = name;
        if (selectedFileBadge) selectedFileBadge.classList.remove('hidden');
        if (btnEntregar) btnEntregar.disabled = false;
        if (searchSuggestions) searchSuggestions.classList.add('hidden');
        if (fileSearchInput) fileSearchInput.value = '';
    };

    const deselectFile = () => {
        archivoSeleccionado = null;
        if (selectedFileBadge) selectedFileBadge.classList.add('hidden');
        if (btnEntregar) btnEntregar.disabled = true;
        if (realFileInput) realFileInput.value = '';
    };

    // Búsqueda interactiva de archivos en el proyecto
    if (fileSearchInput) {
        fileSearchInput.addEventListener('input', () => {
            const query = fileSearchInput.value.toLowerCase().trim();
            if (!query || !proyectoActual || !proyectoActual.archivos) {
                searchSuggestions.classList.add('hidden');
                return;
            }

            const matches = proyectoActual.archivos.filter(archivo => 
                archivo.toLowerCase().includes(query)
            );

            if (matches.length > 0) {
                searchSuggestions.innerHTML = matches.map(match => `
                    <div class="suggestion-item" data-file="${match}">
                        <span>${match}</span>
                        <span style="font-size: 11px; color: var(--accent-blue);">Sugerido</span>
                    </div>
                `).join('');
                searchSuggestions.classList.remove('hidden');

                searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
                    item.addEventListener('click', () => {
                        selectFile(item.getAttribute('data-file'));
                    });
                });
            } else {
                searchSuggestions.innerHTML = `
                    <div class="suggestion-item" style="cursor: default; pointer-events: none; justify-content: center;">
                        <span>No se encontraron archivos</span>
                    </div>
                `;
                searchSuggestions.classList.remove('hidden');
            }
        });

        // Mostrar sugerencias al hacer foco
        fileSearchInput.addEventListener('focus', () => {
            if (!fileSearchInput.value.trim() && proyectoActual && proyectoActual.archivos) {
                const matches = proyectoActual.archivos;
                searchSuggestions.innerHTML = matches.map(match => `
                    <div class="suggestion-item" data-file="${match}">
                        <span>${match}</span>
                        <span style="font-size: 11px; color: var(--accent-blue);">Sugerido</span>
                    </div>
                `).join('');
                searchSuggestions.classList.remove('hidden');

                searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
                    item.addEventListener('click', () => {
                        selectFile(item.getAttribute('data-file'));
                    });
                });
            }
        });
    }

    // Cerrar sugerencias al hacer click fuera
    document.addEventListener('click', (e) => {
        if (searchSuggestions && !searchSuggestions.contains(e.target) && e.target !== fileSearchInput) {
            searchSuggestions.classList.add('hidden');
        }
    });

    // Subir archivo local (Triggers el input de archivo real)
    if (btnUploadTrigger && realFileInput) {
        btnUploadTrigger.addEventListener('click', () => {
            realFileInput.click();
        });

        realFileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                selectFile(e.target.files[0].name);
            }
        });
    }

    // Quitar archivo seleccionado
    if (btnRemoveFile) {
        btnRemoveFile.addEventListener('click', () => {
            deselectFile();
        });
    }

    // 1. Lógica para PEDIR PROYECTO
    if (btnPedir) {
        btnPedir.addEventListener('click', () => {
            // Reiniciar pasos del footer al paso 1 (Requisitos)
            steps.forEach(step => step.classList.remove('active'));
            steps[0].classList.add('active');

            // Obtener un proyecto al azar basado en la dificultad seleccionada
            const proyectosDisponibles = proyectosDB[dificultadActiva];
            const randomIndex = Math.floor(Math.random() * proyectosDisponibles.length);
            proyectoActual = proyectosDisponibles[randomIndex];

            // Inyectar propuesta en el chat
            chatBox.innerHTML = `
                <div class="message-ia">
                    <p><strong>Cliente IA (Dificultad: ${dificultadActiva}):</strong> ¡Hola! He generado una propuesta de proyecto adaptada a tu perfil:</p>
                    <p style="margin-top: 10px;"><strong>Proyecto:</strong> <span style="color: var(--accent-blue); font-weight: bold;">${proyectoActual.nombre}</span></p>
                    <p><strong>Descripción:</strong> ${proyectoActual.descripcion}</p>
                    <p style="margin-top: 10px; font-style: italic;">Por favor, revisa la propuesta y decide si deseas <strong>ACEPTAR</strong> o <strong>RECHAZAR</strong> el proyecto en los botones inferiores.</p>
                </div>
            `;

            // Control de estado de los botones
            btnPedir.disabled = true;
            btnAceptar.disabled = false;
            btnRechazar.disabled = false;
            btnEntregar.disabled = true;

            // Ocultar y resetear contenedor de archivos
            if (fileDeliveryContainer) {
                fileDeliveryContainer.classList.remove('active');
                if (fileSearchInput) fileSearchInput.disabled = true;
                if (btnUploadTrigger) btnUploadTrigger.disabled = true;
                deselectFile();
            }

            scrollChat();
        });
    }

    // 2. Lógica para ACEPTAR PROYECTO
    if (btnAceptar) {
        btnAceptar.addEventListener('click', () => {
            if (!proyectoActual) return;

            // Avanzar el progreso al paso 2 (Desarrollo)
            steps.forEach(step => step.classList.remove('active'));
            steps[1].classList.add('active');

            // Inyectar confirmación y requisitos en el chat
            chatBox.innerHTML += `
                <div class="message-ia" style="border-left-color: var(--accent-green); margin-top: 15px;">
                    <p><strong>Cliente IA:</strong> ¡Excelente decisión! Has <strong>ACEPTADO</strong> el proyecto. Aquí tienes los requerimientos específicos a implementar:</p>
                    <ul style="margin-top: 8px;">
                        ${proyectoActual.requisitos.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                    <p style="margin-top: 10px; font-style: italic;">Para realizar la entrega, <strong>busca o selecciona un archivo</strong> en la sección "ARCHIVOS DE ENTREGA" y luego pulsa el botón <strong>ENTREGAR</strong>.</p>
                </div>
            `;

            // Control de estado de los botones
            btnAceptar.disabled = true;
            btnRechazar.disabled = true;
            btnEntregar.disabled = true; // Deshabilitado hasta seleccionar archivo

            // Activar contenedor de entrega de archivos
            if (fileDeliveryContainer) {
                fileDeliveryContainer.classList.add('active');
                if (fileSearchInput) fileSearchInput.disabled = false;
                if (btnUploadTrigger) btnUploadTrigger.disabled = false;
            }

            scrollChat();
        });
    }

    // 3. Lógica para RECHAZAR PROYECTO
    if (btnRechazar) {
        btnRechazar.addEventListener('click', () => {
            // Inyectar mensaje de rechazo
            chatBox.innerHTML += `
                <div class="message-ia" style="border-left-color: var(--accent-red); margin-top: 15px;">
                    <p><strong>Cliente IA:</strong> Entendido. Has <strong>RECHAZADO</strong> la propuesta. Puedes cambiar la dificultad si lo deseas y volver a pulsar <strong>PEDIR PROYECTO</strong> para recibir otra propuesta.</p>
                </div>
            `;

            // Control de estado de los botones (Volver a pedir)
            btnPedir.disabled = false;
            btnAceptar.disabled = true;
            btnRechazar.disabled = true;
            btnEntregar.disabled = true;

            // Ocultar y resetear contenedor de archivos
            if (fileDeliveryContainer) {
                fileDeliveryContainer.classList.remove('active');
                if (fileSearchInput) fileSearchInput.disabled = true;
                if (btnUploadTrigger) btnUploadTrigger.disabled = true;
                deselectFile();
            }

            scrollChat();
        });
    }

    // 4. Lógica para ENTREGAR PROYECTO
    if (btnEntregar) {
        btnEntregar.addEventListener('click', () => {
            if (!proyectoActual) return;

            // Avanzar el progreso al paso 3 (Testing)
            steps.forEach(step => step.classList.remove('active'));
            steps[2].classList.add('active');

            // Inyectar mensaje de testeo
            chatBox.innerHTML += `
                <div class="message-ia" style="border-left-color: var(--accent-yellow); margin-top: 15px;">
                    <p><strong>Cliente IA:</strong> Archivo de entrega <strong>"${archivoSeleccionado || 'proyecto.zip'}"</strong> recibido con éxito.</p>
                    <p>Iniciando suite de pruebas automatizadas y chequeo de diseño...</p>
                    <p style="margin: 5px 0;"><em>Progreso: Ejecutando pruebas unitarias... (100% completado)</em></p>
                    <p><em>Por favor, espera unos segundos a que se verifique la calidad del código.</em></p>
                </div>
            `;

            btnEntregar.disabled = true;
            
            // Desactivar y resetear la sección de archivos al iniciar test
            if (fileDeliveryContainer) {
                fileDeliveryContainer.classList.remove('active');
                if (fileSearchInput) fileSearchInput.disabled = true;
                if (btnUploadTrigger) btnUploadTrigger.disabled = true;
            }

            scrollChat();

            // Simular un tiempo de testing de 2.5 segundos
            setTimeout(() => {
                // Avanzar el progreso al paso 4 (Entrega)
                steps.forEach(step => step.classList.remove('active'));
                steps[3].classList.add('active');

                // Generar calificaciones aleatorias pero consistentes
                const qCode = Math.floor(Math.random() * 15) + 84; // 84 to 98
                const qFunc = Math.floor(Math.random() * 13) + 88; // 88 to 100
                const qReq = Math.floor(Math.random() * 11) + 90; // 90 to 100
                const finalScore = Math.round((qCode + qFunc + qReq) / 3);
                
                let stars = "★★★";
                let feedbackText = "Entrega aceptable. La funcionalidad básica está presente, pero se recomienda refactorizar y mejorar el control de errores.";
                
                if (finalScore >= 95) {
                    stars = "★★★★★";
                    feedbackText = "Excelente implementación. La estructura es robusta, el código está bien documentado y se han cumplido todos los requerimientos con precisión.";
                } else if (finalScore >= 85) {
                    stars = "★★★★";
                    feedbackText = "Muy buen desarrollo. Cumple con la funcionalidad esperada, aunque se pueden realizar pequeñas mejoras en la optimización del código.";
                }

                // Inyectar mensaje final de éxito con calificación de la IA
                chatBox.innerHTML += `
                    <div class="message-ia" style="border-left-color: var(--accent-blue); margin-top: 15px; background-color: rgba(59, 130, 246, 0.05);">
                        <p><strong style="color: var(--accent-blue);">¡PROYECTO APROBADO CON ÉXITO!</strong></p>
                        <p>El cliente IA ha verificado la entrega del archivo <strong>"${archivoSeleccionado || 'proyecto.zip'}"</strong> para el proyecto <strong>"${proyectoActual.nombre}"</strong>.</p>
                        
                        <!-- TARJETA DE CALIFICACIÓN DE LA IA -->
                        <div class="ia-rating-card">
                            <div class="rating-header">
                                <h4>EVALUACIÓN DEL CLIENTE IA</h4>
                                <div class="stars">${stars}</div>
                            </div>
                            <div class="rating-scores">
                                <div class="score-item">
                                    <span class="score-label">Calidad de Código</span>
                                    <div class="score-bar-wrapper">
                                        <div class="score-bar" data-target-width="${qCode}%" style="width: 0%; background-color: var(--accent-blue);"></div>
                                    </div>
                                    <span class="score-value">${qCode}%</span>
                                </div>
                                <div class="score-item">
                                    <span class="score-label">Funcionalidad</span>
                                    <div class="score-bar-wrapper">
                                        <div class="score-bar" data-target-width="${qFunc}%" style="width: 0%; background-color: var(--accent-green);"></div>
                                    </div>
                                    <span class="score-value">${qFunc}%</span>
                                </div>
                                <div class="score-item">
                                    <span class="score-label">Requisitos Cumplidos</span>
                                    <div class="score-bar-wrapper">
                                        <div class="score-bar" data-target-width="${qReq}%" style="width: 0%; background-color: var(--accent-yellow);"></div>
                                    </div>
                                    <span class="score-value">${qReq}%</span>
                                </div>
                            </div>
                            <div class="rating-summary">
                                <div class="final-score-circle">
                                    <span class="final-score-num">${finalScore}</span>
                                    <span class="final-score-denom">/100</span>
                                </div>
                                <p class="feedback-text">"${feedbackText}"</p>
                            </div>
                        </div>

                        <p style="margin-top: 15px;">¡Gran trabajo! Has ganado experiencia. Puedes pulsar en <strong>PEDIR PROYECTO</strong> para empezar con un nuevo desafío.</p>
                    </div>
                `;

                // Animación de las barras de score en la tarjeta de calificación
                setTimeout(() => {
                    const bars = chatBox.querySelectorAll('.ia-rating-card .score-bar');
                    bars.forEach(bar => {
                        const targetWidth = bar.getAttribute('data-target-width');
                        bar.style.width = targetWidth;
                    });
                }, 100);

                // Resetear archivo seleccionado
                deselectFile();

                // Habilitar la opción de pedir otro proyecto
                btnPedir.disabled = false;
                scrollChat();
            }, 2500);
        });
    }
});
