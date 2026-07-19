import { iniciarSesion } from './auth.js';

const form = document.querySelector('form');

const passwordInput = document.getElementById(
    'password'
);

const togglePassword = document.getElementById(
    'togglePassword'
);

togglePassword.addEventListener('click', () => {
    const mostrar =
        passwordInput.type === 'password';

    passwordInput.type = mostrar
        ? 'text'
        : 'password';

    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');
});

togglePassword.addEventListener('mouseenter', () => {
    togglePassword.style.color = '#3b82f6';
});

togglePassword.addEventListener('mouseleave', () => {
    togglePassword.style.color = '#cbd5e1';
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = form.elements.email.value
        .trim()
        .toLowerCase();

    const password = passwordInput.value;

    const submitButton = form.querySelector(
        'button[type="submit"]'
    );

    submitButton.disabled = true;
    submitButton.textContent = 'Iniciando sesión...';

    try {
        const usuario = await iniciarSesion({
            email,
            password
        });

        await Swal.fire({
            title: '¡Bienvenido!',
            text: `Hola ${usuario.name}, has iniciado sesión correctamente.`,
            icon: 'success',
            timer: 1800,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false
        });

        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error(
            'Error durante el inicio de sesión:',
            error
        );

        Swal.fire({
            title: 'No se pudo iniciar sesión',
            text: error.message,
            icon: 'error'
        });
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Iniciar Sesión';
    }
});