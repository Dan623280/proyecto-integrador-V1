import {
    obtenerSesion,
    eliminarSesion
} from './auth.js';

export function validarSesion() {
    const usuario = obtenerSesion();

    const sesionValida =
        usuario &&
        usuario.id &&
        usuario.name &&
        usuario.email;

    if (!sesionValida) {
        eliminarSesion();
        window.location.href = 'login.html';

        return null;
    }

    return usuario;
}

export function mostrarUsuario(usuario) {
    const devName = document.getElementById('devName');
    const devAvatar = document.getElementById('devAvatar');
    const userAvatar = document.getElementById('userAvatar');
    const headerUserName = document.getElementById(
        'headerUserName'
    );

    if (devName) {
        devName.textContent = usuario.name;
    }

    if (headerUserName) {
        headerUserName.textContent = usuario.name;
    }

    const inicial = usuario.name
        .charAt(0)
        .toUpperCase();

    if (devAvatar) {
        devAvatar.textContent = inicial;
        devAvatar.title = usuario.name;
    }

    if (userAvatar) {
        userAvatar.textContent = inicial;
        userAvatar.title = usuario.name;
    }
}

export function configurarCierreSesion() {
    const logoutBtn = document.getElementById('logoutBtn');

    if (!logoutBtn) {
        return;
    }

    logoutBtn.addEventListener('click', async () => {
        if (typeof Swal === 'undefined') {
            const confirmar = window.confirm(
                '¿Estás seguro de que deseas cerrar sesión?'
            );

            if (confirmar) {
                cerrarSesion();
            }

            return;
        }

        const resultado = await Swal.fire({
            title: '¿Cerrar sesión?',
            text: '¿Estás seguro de que deseas salir de tu cuenta?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar'
        });

        if (!resultado.isConfirmed) {
            return;
        }

        eliminarSesion();

        await Swal.fire({
            title: '¡Sesión cerrada!',
            text: 'Has salido correctamente.',
            icon: 'success',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false
        });

        window.location.href = 'index.html';
    });
}

function cerrarSesion() {
    eliminarSesion();
    window.location.href = 'index.html';
}