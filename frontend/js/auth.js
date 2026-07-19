import { API_URL } from './config.js';

const SESSION_KEY = 'freelancer_user';

async function procesarRespuesta(response) {
    let data = {};

    try {
        data = await response.json();
    } catch (error) {
        console.error(
            'La respuesta del servidor no contiene JSON:',
            error
        );
    }

    if (!response.ok || data.success === false) {
        throw new Error(
            data.message ||
            data.detail ||
            'Ocurrió un error al comunicarse con el servidor.'
        );
    }

    return data;
}

export async function registrarUsuario(usuario) {
    const response = await fetch(
        `${API_URL}/registro`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        }
    );

    return procesarRespuesta(response);
}

export async function iniciarSesion(credenciales) {
    const response = await fetch(
        `${API_URL}/login`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credenciales)
        }
    );

    const data = await procesarRespuesta(response);

    if (!data.usuario) {
        throw new Error(
            'El servidor no devolvió la información del usuario.'
        );
    }

    const usuario = {
        id: data.usuario.id,
        name: data.usuario.nombre,
        email: data.usuario.email
    };

    guardarSesion(usuario);

    return usuario;
}

export function guardarSesion(usuario) {
    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(usuario)
    );
}

export function obtenerSesion() {
    try {
        const session = localStorage.getItem(
            SESSION_KEY
        );

        if (!session) {
            return null;
        }

        return JSON.parse(session);
    } catch (error) {
        console.error(
            'No fue posible leer la sesión:',
            error
        );

        eliminarSesion();

        return null;
    }
}

export function eliminarSesion() {
    localStorage.removeItem(SESSION_KEY);
}