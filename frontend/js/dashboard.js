import { proyectosDB } from './projects.js';

import {
    iniciarEntregaArchivos
} from './delivery.js';

export function iniciarDashboard() {
    const difficultyCards =
        document.querySelectorAll('.option-card');

    const btnPedir =
        document.getElementById('btn-pedir');

    const btnAceptar =
        document.getElementById('btn-aceptar');

    const btnRechazar =
        document.getElementById('btn-rechazar');

    const btnEntregar =
        document.getElementById('btn-entregar');

    const chatBox =
        document.getElementById('chat-box');

    const steps =
        document.querySelectorAll('.step');

    const entrega = iniciarEntregaArchivos();

    let dificultadActiva = 'Semi Senior';
    let proyectoActual = null;

    function activarPaso(indice) {
        steps.forEach((step) => {
            step.classList.remove('active');
        });

        if (steps[indice]) {
            steps[indice].classList.add('active');
        }
    }

    function moverChatAlFinal() {
        if (!chatBox) {
            return;
        }

        chatBox.scrollTo({
            top: chatBox.scrollHeight,
            behavior: 'smooth'
        });
    }

    difficultyCards.forEach((card) => {
        card.addEventListener('click', () => {
            if (
                btnPedir.disabled ||
                !btnAceptar.disabled ||
                !btnRechazar.disabled
            ) {
                return;
            }

            difficultyCards.forEach((element) => {
                element.classList.remove('active');
            });

            card.classList.add('active');

            const title = card.querySelector('strong');

            if (title) {
                dificultadActiva =
                    title.textContent.trim();
            }
        });
    });

    btnPedir.addEventListener('click', () => {
        activarPaso(0);

        const proyectos =
            proyectosDB[dificultadActiva];

        const posicion = Math.floor(
            Math.random() * proyectos.length
        );

        proyectoActual = proyectos[posicion];

        chatBox.innerHTML = `
            <div class="message-ia">
                <p>
                    <strong>
                        Cliente IA
                        (${dificultadActiva}):
                    </strong>

                    He generado una propuesta para ti.
                </p>

                <p style="margin-top: 10px;">
                    <strong>Proyecto:</strong>
                    ${proyectoActual.nombre}
                </p>

                <p>
                    <strong>Descripción:</strong>
                    ${proyectoActual.descripcion}
                </p>

                <p style="margin-top: 10px;">
                    Decide si deseas aceptar o rechazar
                    este proyecto.
                </p>
            </div>
        `;

        btnPedir.disabled = true;
        btnAceptar.disabled = false;
        btnRechazar.disabled = false;
        btnEntregar.disabled = true;

        entrega.desactivar();
        moverChatAlFinal();
    });

    btnAceptar.addEventListener('click', () => {
        if (!proyectoActual) {
            return;
        }

        activarPaso(1);

        const requisitos = proyectoActual.requisitos
            .map((requisito) => {
                return `<li>${requisito}</li>`;
            })
            .join('');

        chatBox.innerHTML += `
            <div
                class="message-ia"
                style="
                    border-left-color:
                    var(--accent-green);
                    margin-top: 15px;
                "
            >
                <p>
                    <strong>Cliente IA:</strong>
                    Has aceptado el proyecto.
                </p>

                <p>Requerimientos:</p>

                <ul>
                    ${requisitos}
                </ul>

                <p>
                    Selecciona un archivo y realiza
                    la entrega.
                </p>
            </div>
        `;

        btnAceptar.disabled = true;
        btnRechazar.disabled = true;
        btnEntregar.disabled = true;

        entrega.activar(proyectoActual);
        moverChatAlFinal();
    });

    btnRechazar.addEventListener('click', () => {
        chatBox.innerHTML += `
            <div
                class="message-ia"
                style="
                    border-left-color:
                    var(--accent-red);
                    margin-top: 15px;
                "
            >
                <p>
                    <strong>Cliente IA:</strong>
                    Has rechazado el proyecto.
                    Puedes solicitar otro.
                </p>
            </div>
        `;

        btnPedir.disabled = false;
        btnAceptar.disabled = true;
        btnRechazar.disabled = true;
        btnEntregar.disabled = true;

        proyectoActual = null;

        entrega.desactivar();
        moverChatAlFinal();
    });

    btnEntregar.addEventListener('click', () => {
        const archivo =
            entrega.obtenerArchivo();

        if (!archivo) {
            Swal.fire({
                title: 'Selecciona un archivo',
                text:
                    'Debes seleccionar un archivo antes de entregar.',
                icon: 'warning'
            });

            return;
        }

        activarPaso(2);

        chatBox.innerHTML += `
            <div
                class="message-ia"
                style="
                    border-left-color:
                    var(--accent-yellow);
                    margin-top: 15px;
                "
            >
                <p>
                    Archivo
                    <strong>"${archivo}"</strong>
                    recibido.
                </p>

                <p>
                    Ejecutando pruebas automatizadas...
                </p>
            </div>
        `;

        btnEntregar.disabled = true;
        entrega.desactivar();
        moverChatAlFinal();

        setTimeout(() => {
            activarPaso(3);

            const calidad =
                Math.floor(Math.random() * 15) + 84;

            const funcionalidad =
                Math.floor(Math.random() * 13) + 88;

            const requisitos =
                Math.floor(Math.random() * 11) + 90;

            const promedio = Math.round(
                (
                    calidad +
                    funcionalidad +
                    requisitos
                ) / 3
            );

            chatBox.innerHTML += `
                <div
                    class="message-ia"
                    style="
                        border-left-color:
                        var(--accent-blue);
                        margin-top: 15px;
                    "
                >
                    <p>
                        <strong>
                            ¡Proyecto aprobado!
                        </strong>
                    </p>

                    <p>
                        Proyecto:
                        ${proyectoActual.nombre}
                    </p>

                    <p>
                        Calidad del código:
                        ${calidad}%
                    </p>

                    <p>
                        Funcionalidad:
                        ${funcionalidad}%
                    </p>

                    <p>
                        Requisitos:
                        ${requisitos}%
                    </p>

                    <p>
                        <strong>
                            Calificación final:
                            ${promedio}/100
                        </strong>
                    </p>
                </div>
            `;

            btnPedir.disabled = false;
            proyectoActual = null;

            entrega.limpiar();
            moverChatAlFinal();
        }, 2500);
    });
}