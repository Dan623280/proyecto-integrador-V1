import { registrarUsuario } from './auth.js';

const form = document.getElementById('registerForm');

const passwordInput = document.getElementById('password');

const confirmPasswordInput = document.getElementById(
    'confirmPassword'
);

const togglePassword = document.getElementById(
    'togglePassword'
);

const toggleConfirmPassword = document.getElementById(
    'toggleConfirmPassword'
);

function configurarVisualizacionPassword(
    boton,
    input
) {
    if (!boton || !input) {
        return;
    }

    boton.addEventListener('click', () => {
        const mostrar =
            input.type === 'password';

        input.type = mostrar
            ? 'text'
            : 'password';

        boton.classList.toggle('fa-eye');
        boton.classList.toggle('fa-eye-slash');
    });

    boton.addEventListener('mouseenter', () => {
        boton.style.color = '#3b82f6';
    });

    boton.addEventListener('mouseleave', () => {
        boton.style.color = '#cbd5e1';
    });
}

configurarVisualizacionPassword(
    togglePassword,
    passwordInput
);

configurarVisualizacionPassword(
    toggleConfirmPassword,
    confirmPasswordInput
);

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nombre = form.elements.name.value.trim();

    const email = form.elements.email.value
        .trim()
        .toLowerCase();

    const password = passwordInput.value;

    const confirmPassword =
        confirmPasswordInput.value;

    if (password !== confirmPassword) {
        Swal.fire({
            title: 'Las contraseñas no coinciden',
            text: 'Verifica las contraseñas e inténtalo nuevamente.',
            icon: 'error'
        });

        return;
    }

    const submitButton = form.querySelector(
        'button[type="submit"]'
    );

    submitButton.disabled = true;
    submitButton.textContent = 'Registrando...';

    try {
        const resultado = await registrarUsuario({
            nombre,
            email,
            password
        });

        await Swal.fire({
            title: '¡Registro exitoso!',
            text:
                resultado.message ||
                'Tu cuenta fue creada correctamente.',
            icon: 'success',
            confirmButtonText: 'Ir a iniciar sesión',
            allowOutsideClick: false
        });

        form.reset();

        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error durante el registro:', error);

        Swal.fire({
            title: 'No se pudo crear la cuenta',
            text: error.message,
            icon: 'error'
        });
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Registrarse';
    }
});