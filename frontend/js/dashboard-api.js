import { API_URL } from './config.js';

/**
 * Centraliza las llamadas del dashboard para que la interfaz no conozca
 * detalles de fetch, encabezados ni el formato de las respuestas.
 */
export function crearDashboardApi({ usuarioId, obtenerApiKey }) {
    async function procesarRespuesta(response) {
        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.success === false) {
            throw new Error(
                data.detail || data.message || 'Ocurrió un error en el servidor.'
            );
        }

        return data;
    }

    function encabezadosGemini() {
        const apiKey = obtenerApiKey();
        if (!apiKey) {
            throw new Error('Primero configura tu API key de Gemini.');
        }

        return { 'X-Gemini-API-Key': apiKey };
    }

    return {
        async generarProyecto(dificultad) {
            const response = await fetch(`${API_URL}/ai/projects/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...encabezadosGemini()
                },
                body: JSON.stringify({ usuario_id: usuarioId, dificultad })
            });
            return procesarRespuesta(response);
        },

        async aceptarProyecto(proyecto) {
            const response = await fetch(`${API_URL}/ai/projects/accept`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario_id: usuarioId,
                    nombre: proyecto.nombre,
                    descripcion: proyecto.descripcion,
                    dificultad: proyecto.dificultad,
                    duracion_estimada: proyecto.duracion_estimada,
                    objetivo: proyecto.objetivo,
                    requisitos: proyecto.requisitos,
                    archivos: proyecto.archivos
                })
            });
            return procesarRespuesta(response);
        },

        async entregarProyecto(proyectoId, archivos) {
            const formData = new FormData();
            formData.append('proyecto_id', proyectoId);
            archivos.forEach((archivo) => formData.append('archivos', archivo));

            const response = await fetch(`${API_URL}/ai/evaluate`, {
                method: 'POST',
                headers: encabezadosGemini(),
                body: formData
            });
            return procesarRespuesta(response);
        },

        async obtenerProyectos() {
            const response = await fetch(`${API_URL}/ai/projects/user/${usuarioId}`);
            return procesarRespuesta(response);
        }
    };
}
