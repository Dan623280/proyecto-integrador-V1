import { API_URL } from './config.js';
import { iniciarEntregaArchivos } from './delivery.js';

const SESSION_KEY = 'freelancer_user';

document.addEventListener('DOMContentLoaded', () => {
    const usuario = obtenerUsuario();

    if (!usuario) {
        window.location.href = 'login.html';
        return;
    }

    // =====================================================
    // ELEMENTOS DEL HTML
    // =====================================================

    const nombreUsuario = document.getElementById(
        'user-name'
    );

    const btnLogout = document.getElementById(
        'btn-logout'
    );

    const btnPedir = document.getElementById(
        'btn-pedir'
    );

    const btnAceptar = document.getElementById(
        'btn-aceptar'
    );

    const btnRechazar = document.getElementById(
        'btn-rechazar'
    );

    const btnEntregar = document.getElementById(
        'btn-entregar'
    );

    const chatBox = document.getElementById(
        'chat-box'
    );

    const botonesDificultad = document.querySelectorAll(
        '[data-difficulty]'
    );

    const steps = document.querySelectorAll(
        '.step'
    );

    const historialContainer = document.getElementById(
        'projects-history'
    );
    const apiKeyInput = document.getElementById('gemini-api-key');
    const apiKeyStatus = document.getElementById('api-key-status');
    const saveApiKey = document.getElementById('save-api-key');
    const toggleApiKey = document.getElementById('toggle-api-key');

    // =====================================================
    // ESTADO
    // =====================================================

    let dificultadActiva = 'Junior';
    let proyectoActual = null;
    let enviandoSolicitud = false;

    const entregaArchivos =
        iniciarEntregaArchivos();

    // =====================================================
    // CONFIGURACIÓN INICIAL
    // =====================================================

    if (nombreUsuario) {
        nombreUsuario.textContent =
            usuario.name || usuario.nombre || 'Usuario';
    }

    seleccionarDificultadVisual(
        dificultadActiva
    );

    actualizarBotones({
        pedir: true,
        aceptar: false,
        rechazar: false,
        entregar: false
    });

    entregaArchivos.desactivar();

    cargarProyectosUsuario();

    function obtenerApiKey() {
        return localStorage.getItem(`freelancer_gemini_api_key_${usuario.id}`)?.trim() || '';
    }

    function actualizarEstadoApiKey() {
        const configurada = Boolean(obtenerApiKey());
        if (apiKeyInput) apiKeyInput.value = obtenerApiKey();
        if (apiKeyStatus) {
            apiKeyStatus.textContent = configurada ? 'Gemini listo para usar' : 'Clave pendiente';
            apiKeyStatus.classList.toggle('ready', configurada);
        }
        return configurada;
    }

    actualizarEstadoApiKey();

    saveApiKey?.addEventListener('click', () => {
        const clave = apiKeyInput.value.trim();
        if (clave.length < 20) {
            mostrarAlerta('Clave no válida', 'Pega una API key válida de Google AI Studio.', 'warning');
            return;
        }
        localStorage.setItem(`freelancer_gemini_api_key_${usuario.id}`, clave);
        actualizarEstadoApiKey();
        mostrarAlerta('Gemini conectado', 'La clave quedó guardada únicamente en este navegador.', 'success');
    });

    toggleApiKey?.addEventListener('click', () => {
        apiKeyInput.type = apiKeyInput.type === 'password' ? 'text' : 'password';
        toggleApiKey.querySelector('i')?.classList.toggle('fa-eye-slash');
    });

    // =====================================================
    // SESIÓN
    // =====================================================

    function obtenerUsuario() {
        const usuarioGuardado =
            localStorage.getItem(SESSION_KEY);

        if (!usuarioGuardado) {
            return null;
        }

        try {
            const usuarioParseado =
                JSON.parse(usuarioGuardado);

            if (!usuarioParseado?.id) {
                return null;
            }

            return usuarioParseado;

        } catch (error) {
            console.error(
                'No se pudo leer la sesión:',
                error
            );

            localStorage.removeItem(SESSION_KEY);

            return null;
        }
    }

    function cerrarSesion() {
        localStorage.removeItem(SESSION_KEY);
        window.location.href = 'login.html';
    }

    // =====================================================
    // PETICIONES HTTP
    // =====================================================

    async function procesarRespuesta(response) {
        let data = {};

        try {
            data = await response.json();
        } catch (error) {
            console.error(
                'La respuesta no contiene JSON:',
                error
            );
        }

        if (!response.ok || data.success === false) {
            throw new Error(
                data.detail ||
                data.message ||
                'Ocurrió un error en el servidor.'
            );
        }

        return data;
    }

    async function generarProyectoIA() {
        const apiKey = obtenerApiKey();
        if (!apiKey) throw new Error('Primero configura tu API key de Gemini.');
        const response = await fetch(
            `${API_URL}/ai/projects/generate`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Gemini-API-Key': apiKey
                },
                body: JSON.stringify({
                    usuario_id: usuario.id,
                    dificultad: dificultadActiva
                })
            }
        );

        return procesarRespuesta(response);
    }

    async function aceptarProyectoAPI(
        proyecto
    ) {
        const response = await fetch(
            `${API_URL}/ai/projects/accept`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario_id: usuario.id,
                    nombre: proyecto.nombre,
                    descripcion: proyecto.descripcion,
                    dificultad: proyecto.dificultad,
                    duracion_estimada: proyecto.duracion_estimada,
                    objetivo: proyecto.objetivo,
                    requisitos: proyecto.requisitos,
                    archivos: proyecto.archivos
                })
            }
        );

        return procesarRespuesta(response);
    }

    async function rechazarProyectoAPI(
        proyectoId
    ) {
        const response = await fetch(
            `${API_URL}/ai/projects/${proyectoId}/reject`,
            {
                method: 'PATCH'
            }
        );

        return procesarRespuesta(response);
    }

    async function entregarProyectoAPI(
        proyectoId,
        archivos
    ) {
        const formData = new FormData();

        formData.append(
            'proyecto_id',
            proyectoId
        );

        archivos.forEach((archivo) => {
            formData.append('archivos', archivo);
        });

        const apiKey = obtenerApiKey();
        if (!apiKey) throw new Error('Primero configura tu API key de Gemini.');
        const response = await fetch(
            `${API_URL}/ai/evaluate`,
            {
                method: 'POST',
                headers: { 'X-Gemini-API-Key': apiKey },
                body: formData
            }
        );

        return procesarRespuesta(response);
    }

    async function obtenerProyectosUsuarioAPI() {
        const response = await fetch(
            `${API_URL}/ai/projects/user/${usuario.id}`
        );

        return procesarRespuesta(response);
    }

    // =====================================================
    // DIFICULTAD
    // =====================================================

    botonesDificultad.forEach((boton) => {
        boton.addEventListener('click', () => {
            if (proyectoActual) {
                mostrarAlerta(
                    'Proyecto activo',
                    'Debes aceptar, rechazar o finalizar el proyecto actual antes de cambiar la dificultad.',
                    'warning'
                );

                return;
            }

            dificultadActiva =
                boton.dataset.difficulty;

            seleccionarDificultadVisual(
                dificultadActiva
            );
        });
    });

    function seleccionarDificultadVisual(
        dificultad
    ) {
        botonesDificultad.forEach((boton) => {
            const estaActivo =
                boton.dataset.difficulty === dificultad;

            boton.classList.toggle(
                'active',
                estaActivo
            );
        });
    }

    // =====================================================
    // PEDIR PROYECTO
    // =====================================================

    if (btnPedir) {
        btnPedir.addEventListener(
            'click',
            async () => {
                if (enviandoSolicitud) {
                    return;
                }

                enviandoSolicitud = true;

                actualizarBotones({
                    pedir: false,
                    aceptar: false,
                    rechazar: false,
                    entregar: false
                });

                cambiarTextoBoton(
                    btnPedir,
                    'Generando...'
                );

                mostrarMensajeIA(`
                    <p>
                        <strong>Cliente IA:</strong>
                        Estoy generando un proyecto nuevo para el nivel
                        <strong>${escaparHTML(dificultadActiva)}</strong>.
                    </p>
                    <p>
                        La propuesta será creada por la inteligencia artificial.
                        Solo se guardará si decides aceptarla.
                    </p>
                `);

                try {
                    const data =
                        await generarProyectoIA();

                    proyectoActual =
                        data.proyecto;

                    mostrarProyectoGenerado(
                        proyectoActual
                    );

                    actualizarBotones({
                        pedir: false,
                        aceptar: true,
                        rechazar: true,
                        entregar: false
                    });

                    activarPaso(0);

                    await cargarProyectosUsuario();

                } catch (error) {
                    console.error(
                        'Error generando proyecto:',
                        error
                    );

                    mostrarAlerta(
                        'No se pudo generar el proyecto',
                        error.message,
                        'error'
                    );

                    mostrarMensajeIA(`
                        <p>
                            <strong>Cliente IA:</strong>
                            No fue posible generar el proyecto.
                        </p>
                        <p>
                            ${escaparHTML(error.message)}
                        </p>
                    `);

                    actualizarBotones({
                        pedir: true,
                        aceptar: false,
                        rechazar: false,
                        entregar: false
                    });

                } finally {
                    enviandoSolicitud = false;

                    cambiarTextoBoton(
                        btnPedir,
                        'Pedir Proyecto'
                    );
                }
            }
        );
    }

    // =====================================================
    // ACEPTAR PROYECTO
    // =====================================================

    if (btnAceptar) {
        btnAceptar.addEventListener(
            'click',
            async () => {
                if (!proyectoActual?.nombre) {
                    mostrarAlerta(
                        'Proyecto inválido',
                        'No existe un proyecto válido para aceptar.',
                        'error'
                    );

                    return;
                }

                actualizarBotones({
                    pedir: false,
                    aceptar: false,
                    rechazar: false,
                    entregar: false
                });

                cambiarTextoBoton(
                    btnAceptar,
                    'Aceptando...'
                );

                try {
                    const data =
                        await aceptarProyectoAPI(
                            proyectoActual
                        );

                    proyectoActual.estado =
                        data.proyecto.estado;
                    proyectoActual.id = data.proyecto.id;

                    entregaArchivos.activar(
                        proyectoActual
                    );

                    mostrarProyectoAceptado(
                        proyectoActual
                    );

                    activarPaso(1);

                    actualizarBotones({
                        pedir: false,
                        aceptar: false,
                        rechazar: false,
                        entregar: false
                    });

                    await cargarProyectosUsuario();

                } catch (error) {
                    console.error(
                        'Error aceptando proyecto:',
                        error
                    );

                    mostrarAlerta(
                        'No se pudo aceptar',
                        error.message,
                        'error'
                    );

                    actualizarBotones({
                        pedir: false,
                        aceptar: true,
                        rechazar: true,
                        entregar: false
                    });

                } finally {
                    cambiarTextoBoton(
                        btnAceptar,
                        'Aceptar'
                    );
                }
            }
        );
    }

    // =====================================================
    // RECHAZAR PROYECTO
    // =====================================================

    if (btnRechazar) {
        btnRechazar.addEventListener(
            'click',
            async () => {
                if (!proyectoActual?.nombre) {
                    return;
                }

                const confirmado =
                    await confirmarAccion(
                        '¿Rechazar proyecto?',
                        'La propuesta se descartará y no se guardará en tu historial.'
                    );

                if (!confirmado) {
                    return;
                }

                actualizarBotones({
                    pedir: false,
                    aceptar: false,
                    rechazar: false,
                    entregar: false
                });

                cambiarTextoBoton(
                    btnRechazar,
                    'Rechazando...'
                );

                try {
                    mostrarMensajeIA(`
                        <p>
                            <strong>Cliente IA:</strong>
                            El proyecto
                            <strong>${escaparHTML(proyectoActual.nombre)}</strong>
                            fue rechazado.
                        </p>
                        <p>
                            Puedes solicitar una propuesta diferente.
                        </p>
                    `);

                    proyectoActual = null;

                    entregaArchivos.desactivar();

                    activarPaso(0);

                    actualizarBotones({
                        pedir: true,
                        aceptar: false,
                        rechazar: false,
                        entregar: false
                    });

                    await cargarProyectosUsuario();

                } catch (error) {
                    console.error(
                        'Error rechazando proyecto:',
                        error
                    );

                    mostrarAlerta(
                        'No se pudo rechazar',
                        error.message,
                        'error'
                    );

                    actualizarBotones({
                        pedir: false,
                        aceptar: true,
                        rechazar: true,
                        entregar: false
                    });

                } finally {
                    cambiarTextoBoton(
                        btnRechazar,
                        'Rechazar'
                    );
                }
            }
        );
    }

    // =====================================================
    // ENTREGAR PROYECTO
    // =====================================================

    if (btnEntregar) {
        btnEntregar.addEventListener(
            'click',
            async () => {
                if (!proyectoActual?.id) {
                    mostrarAlerta(
                        'Sin proyecto',
                        'No hay un proyecto activo.',
                        'error'
                    );

                    return;
                }

                if (
                    proyectoActual.estado !==
                    'aceptado'
                ) {
                    mostrarAlerta(
                        'Proyecto no aceptado',
                        'Primero debes aceptar el proyecto.',
                        'warning'
                    );

                    return;
                }

                const archivos =
                    entregaArchivos.obtenerArchivos();

                if (!archivos.length) {
                    mostrarAlerta(
                        'Archivo requerido',
                        'Selecciona uno o más archivos reales desde tu computador.',
                        'warning'
                    );

                    return;
                }

                btnEntregar.disabled = true;

                cambiarTextoBoton(
                    btnEntregar,
                    'Evaluando...'
                );

                activarPaso(2);

                mostrarMensajeIA(`
                    <p>
                        <strong>Cliente IA:</strong>
                        Recibí ${archivos.length} archivo${archivos.length === 1 ? '' : 's'}:
                        <strong>${archivos.map((archivo) => escaparHTML(archivo.name)).join(', ')}</strong>.
                    </p>
                    <p>
                        Estoy leyendo el código y comparándolo con los
                        requisitos del proyecto
                        <strong>${escaparHTML(proyectoActual.nombre)}</strong>.
                    </p>
                `);

                try {
                    const data =
                        await entregarProyectoAPI(
                            proyectoActual.id,
                            archivos
                        );

                    proyectoActual.estado =
                        'evaluado';

                    activarPaso(3);

                    mostrarEvaluacion(
                        data.evaluacion,
                        archivos.map((archivo) => archivo.name).join(', ')
                    );

                    entregaArchivos.limpiar();
                    entregaArchivos.desactivar();

                    proyectoActual = null;

                    actualizarBotones({
                        pedir: true,
                        aceptar: false,
                        rechazar: false,
                        entregar: false
                    });

                    await cargarProyectosUsuario();

                } catch (error) {
                    console.error(
                        'Error evaluando proyecto:',
                        error
                    );

                    mostrarAlerta(
                        'No se pudo evaluar',
                        error.message,
                        'error'
                    );

                    activarPaso(1);

                    btnEntregar.disabled = false;

                } finally {
                    cambiarTextoBoton(
                        btnEntregar,
                        'Entregar'
                    );
                }
            }
        );
    }

    /*
     * delivery.js activa este botón cuando
     * existe un objeto File real.
     */
    const observer = new MutationObserver(() => {
        if (
            proyectoActual?.estado === 'aceptado'
        ) {
            const archivos =
                entregaArchivos.obtenerArchivos();

            if (btnEntregar) {
                btnEntregar.disabled = !archivos.length;
            }
        }
    });

    const selectedBadge = document.getElementById(
        'selected-file-badge'
    );

    if (selectedBadge) {
        observer.observe(
            selectedBadge,
            {
                attributes: true,
                attributeFilter: ['class']
            }
        );
    }

    // =====================================================
    // HISTORIAL
    // =====================================================

    async function cargarProyectosUsuario() {
        if (!historialContainer) {
            return;
        }

        historialContainer.innerHTML = `
            <p>Cargando proyectos...</p>
        `;

        try {
            const data =
                await obtenerProyectosUsuarioAPI();

            mostrarHistorial(
                data.proyectos || []
            );

        } catch (error) {
            console.error(
                'Error cargando historial:',
                error
            );

            historialContainer.innerHTML = `
                <p>
                    No se pudo cargar el historial.
                </p>
            `;
        }
    }

    function mostrarHistorial(proyectos) {
        if (!historialContainer) {
            return;
        }

        if (proyectos.length === 0) {
            historialContainer.innerHTML = `
                <div class="empty-projects">
                    <p>
                        Todavía no tienes proyectos registrados.
                    </p>
                </div>
            `;

            return;
        }

        historialContainer.innerHTML = proyectos
            .map((proyecto) => {
                return `
                    <article class="project-history-card">
                        <div class="project-history-header">
                            <h3>
                                ${escaparHTML(proyecto.nombre)}
                            </h3>

                            <span class="project-status status-${escaparHTML(proyecto.estado)}">
                                ${formatearEstado(proyecto.estado)}
                            </span>
                        </div>

                        <p>
                            ${escaparHTML(proyecto.descripcion)}
                        </p>

                        <div class="project-history-info">
                            <span>
                                Nivel:
                                <strong>
                                    ${escaparHTML(proyecto.dificultad)}
                                </strong>
                            </span>

                            <span>
                                Duración:
                                <strong>
                                    ${escaparHTML(
                                        proyecto.duracion_estimada ||
                                        'No indicada'
                                    )}
                                </strong>
                            </span>

                            ${proyecto.estado === 'evaluado' && proyecto.calificacion != null
                                ? `<span class="project-score"><i class="fa-solid fa-star"></i> Calificación: <strong>${escaparHTML(proyecto.calificacion)}/100</strong></span>`
                                : ''}
                        </div>
                    </article>
                `;
            })
            .join('');
    }

    // =====================================================
    // INTERFAZ
    // =====================================================

    function mostrarProyectoGenerado(
        proyecto
    ) {
        const requisitos = Array.isArray(
            proyecto.requisitos
        )
            ? proyecto.requisitos
            : [];

        const archivos = Array.isArray(
            proyecto.archivos
        )
            ? proyecto.archivos
            : [];

        mostrarMensajeIA(`
            <p>
                <strong>
                    Cliente IA — ${escaparHTML(proyecto.dificultad)}
                </strong>
            </p>

            <p>
                He generado una propuesta nueva para ti:
            </p>

            <h3>
                ${escaparHTML(proyecto.nombre)}
            </h3>

            <p>
                <strong>Descripción:</strong>
                ${escaparHTML(proyecto.descripcion)}
            </p>

            <p>
                <strong>Objetivo:</strong>
                ${escaparHTML(
                    proyecto.objetivo ||
                    'No especificado'
                )}
            </p>

            <p>
                <strong>Duración estimada:</strong>
                ${escaparHTML(
                    proyecto.duracion_estimada ||
                    'No especificada'
                )}
            </p>

            <p>
                <strong>Requisitos:</strong>
            </p>

            <ul>
                ${requisitos
                    .map(
                        (requisito) =>
                            `<li>${escaparHTML(requisito)}</li>`
                    )
                    .join('')}
            </ul>

            <p>
                <strong>Archivos esperados:</strong>
                ${archivos
                    .map(escaparHTML)
                    .join(', ')}
            </p>

            <p>
                Esta propuesta todavía no está guardada. Puedes aceptarla o solicitar otra.
            </p>
        `);
    }

    function mostrarProyectoAceptado(
        proyecto
    ) {
        const requisitos = Array.isArray(
            proyecto.requisitos
        )
            ? proyecto.requisitos
            : [];

        mostrarMensajeIA(`
            <p>
                <strong>Cliente IA:</strong>
                Has aceptado el proyecto
                <strong>${escaparHTML(proyecto.nombre)}</strong>.
            </p>

            <p>
                Desarrolla la solución teniendo en cuenta:
            </p>

            <ul>
                ${requisitos
                    .map(
                        (requisito) =>
                            `<li>${escaparHTML(requisito)}</li>`
                    )
                    .join('')}
            </ul>

            <p>
                Cuando termines, selecciona el archivo real desde
                tu computador y presiona
                <strong>Entregar</strong>.
            </p>
        `);
    }

    function mostrarEvaluacion(
        evaluacion,
        nombreArchivo
    ) {
        const calificacion = Number(
            evaluacion.calificacion ?? 0
        );

        const fortalezas = Array.isArray(
            evaluacion.fortalezas
        )
            ? evaluacion.fortalezas
            : [];

        const aspectosMejorar = Array.isArray(
            evaluacion.aspectos_mejorar
        )
            ? evaluacion.aspectos_mejorar
            : [];

        const requisitosCumplidos = Array.isArray(
            evaluacion.requisitos_cumplidos
        )
            ? evaluacion.requisitos_cumplidos
            : [];

        const requisitosNoCumplidos = Array.isArray(
            evaluacion.requisitos_no_cumplidos
        )
            ? evaluacion.requisitos_no_cumplidos
            : [];

        mostrarMensajeIA(`
            <div class="ia-rating-card">
                <h3>Evaluación de la IA</h3>

                <p>
                    Archivo evaluado:
                    <strong>${escaparHTML(nombreArchivo)}</strong>
                </p>

                <div class="final-score-circle">
                    <span class="final-score-num">
                        ${calificacion}
                    </span>
                    <span class="final-score-denom">
                        /100
                    </span>
                </div>

                <p>
                    <strong>Reporte:</strong>
                </p>

                <p>
                    ${escaparHTML(
                        evaluacion.reporte ||
                        'Sin reporte disponible.'
                    )}
                </p>

                ${crearListaEvaluacion(
                    'Fortalezas',
                    fortalezas
                )}

                ${crearListaEvaluacion(
                    'Aspectos por mejorar',
                    aspectosMejorar
                )}

                ${crearListaEvaluacion(
                    'Requisitos cumplidos',
                    requisitosCumplidos
                )}

                ${crearListaEvaluacion(
                    'Requisitos pendientes',
                    requisitosNoCumplidos
                )}
            </div>
        `);
    }

    function crearListaEvaluacion(
        titulo,
        elementos
    ) {
        if (!elementos.length) {
            return '';
        }

        return `
            <div class="evaluation-section">
                <p>
                    <strong>${escaparHTML(titulo)}:</strong>
                </p>

                <ul>
                    ${elementos
                        .map(
                            (elemento) =>
                                `<li>${escaparHTML(elemento)}</li>`
                        )
                        .join('')}
                </ul>
            </div>
        `;
    }

    function mostrarMensajeIA(contenido) {
        if (!chatBox) {
            return;
        }

        chatBox.innerHTML += `
            <div class="message-ia">
                ${contenido}
            </div>
        `;

        chatBox.scrollTop =
            chatBox.scrollHeight;
    }

    function actualizarBotones({
        pedir,
        aceptar,
        rechazar,
        entregar
    }) {
        if (btnPedir) {
            btnPedir.disabled = !pedir;
        }

        if (btnAceptar) {
            btnAceptar.disabled = !aceptar;
        }

        if (btnRechazar) {
            btnRechazar.disabled = !rechazar;
        }

        if (btnEntregar) {
            btnEntregar.disabled = !entregar;
        }
    }

    function activarPaso(indice) {
        steps.forEach((step, posicion) => {
            step.classList.toggle(
                'active',
                posicion === indice
            );
        });
    }

    function cambiarTextoBoton(
        boton,
        texto
    ) {
        if (boton) {
            boton.textContent = texto;
        }
    }

    function formatearEstado(estado) {
        const estados = {
            propuesto: 'Propuesto',
            aceptado: 'En desarrollo',
            rechazado: 'Rechazado',
            entregado: 'Entregado',
            evaluado: 'Evaluado'
        };

        return estados[estado] || estado;
    }

    function escaparHTML(valor) {
        return String(valor ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    async function mostrarAlerta(
        titulo,
        mensaje,
        icono
    ) {
        if (window.Swal) {
            return Swal.fire({
                title: titulo,
                text: mensaje,
                icon: icono,
                confirmButtonText: 'Aceptar'
            });
        }

        alert(`${titulo}\n\n${mensaje}`);
    }

    async function confirmarAccion(
        titulo,
        mensaje
    ) {
        if (window.Swal) {
            const resultado = await Swal.fire({
                title: titulo,
                text: mensaje,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, continuar',
                cancelButtonText: 'Cancelar'
            });

            return resultado.isConfirmed;
        }

        return confirm(
            `${titulo}\n\n${mensaje}`
        );
    }

    // =====================================================
    // CERRAR SESIÓN
    // =====================================================

    if (btnLogout) {
        btnLogout.addEventListener(
            'click',
            async () => {
                const confirmado =
                    await confirmarAccion(
                        '¿Cerrar sesión?',
                        'Podrás volver a iniciar sesión y consultar tus proyectos guardados.'
                    );

                if (confirmado) {
                    cerrarSesion();
                }
            }
        );
    }
});
