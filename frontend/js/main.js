import {
    validarSesion,
    mostrarUsuario,
    configurarCierreSesion
} from './session.js';

import {
    iniciarDashboard
} from './dashboard.js';

document.addEventListener(
    'DOMContentLoaded',
    () => {
        const usuario = validarSesion();

        if (!usuario) {
            return;
        }

        mostrarUsuario(usuario);

        configurarCierreSesion();

        iniciarDashboard();
    }
);