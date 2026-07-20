export function iniciarEntregaArchivos() {
    const container = document.getElementById('file-delivery-container');
    const searchInput = document.getElementById('file-search-input');
    const suggestions = document.getElementById('search-suggestions');
    const uploadButton = document.getElementById('btn-upload-trigger');
    const fileInput = document.getElementById('real-file-input');
    const selectedBadge = document.getElementById('selected-file-badge');
    const selectedList = document.getElementById('selected-file-list');
    const deliverButton = document.getElementById('btn-entregar');
    let proyectoActual = null;
    let archivosSeleccionados = [];

    function escaparHTML(valor) {
        return String(valor ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
    }

    function renderizarArchivos() {
        if (selectedList) {
            selectedList.innerHTML = archivosSeleccionados.map((archivo, indice) => `
                <div class="selected-file-item">
                    <span><i class="fa-solid fa-file-code"></i> ${escaparHTML(archivo.name)}</span>
                    <button type="button" class="btn-remove-file" data-index="${indice}" aria-label="Quitar archivo"><i class="fa-solid fa-xmark"></i></button>
                </div>`).join('');
            selectedList.querySelectorAll('[data-index]').forEach((boton) => {
                boton.addEventListener('click', () => {
                    archivosSeleccionados.splice(Number(boton.dataset.index), 1);
                    renderizarArchivos();
                });
            });
        }
        selectedBadge?.classList.toggle('hidden', archivosSeleccionados.length === 0);
        if (deliverButton) deliverButton.disabled = archivosSeleccionados.length === 0;
    }

    function agregarArchivos(nuevosArchivos) {
        const existentes = new Set(archivosSeleccionados.map((archivo) => `${archivo.name}-${archivo.size}`));
        Array.from(nuevosArchivos).forEach((archivo) => {
            const clave = `${archivo.name}-${archivo.size}`;
            if (archivo instanceof File && !existentes.has(clave)) {
                archivosSeleccionados.push(archivo);
                existentes.add(clave);
            }
        });
        renderizarArchivos();
        suggestions?.classList.add('hidden');
        if (searchInput) searchInput.value = '';
    }

    function limpiarArchivos() {
        archivosSeleccionados = [];
        if (fileInput) fileInput.value = '';
        renderizarArchivos();
    }

    function mostrarSugerencias(archivos) {
        if (!suggestions || !Array.isArray(archivos) || archivos.length === 0) {
            suggestions?.classList.add('hidden');
            return;
        }
        suggestions.innerHTML = archivos.map((archivo) => `<div class="suggestion-item" data-file="${escaparHTML(archivo)}"><span>${escaparHTML(archivo)}</span><span>Archivo esperado</span></div>`).join('');
        suggestions.classList.remove('hidden');
        suggestions.querySelectorAll('.suggestion-item').forEach((item) => item.addEventListener('click', () => {
            if (searchInput) searchInput.value = item.dataset.file;
            suggestions.classList.add('hidden');
            fileInput?.click();
        }));
    }

    searchInput?.addEventListener('input', () => {
        const texto = searchInput.value.trim().toLowerCase();
        if (!texto || !Array.isArray(proyectoActual?.archivos)) return mostrarSugerencias([]);
        mostrarSugerencias(proyectoActual.archivos.filter((archivo) => archivo.toLowerCase().includes(texto)));
    });
    searchInput?.addEventListener('focus', () => mostrarSugerencias(proyectoActual?.archivos));
    uploadButton?.addEventListener('click', () => fileInput?.click());
    fileInput?.addEventListener('change', () => agregarArchivos(fileInput.files || []));
    document.addEventListener('click', (event) => {
        if (suggestions && !suggestions.contains(event.target) && event.target !== searchInput) suggestions.classList.add('hidden');
    });

    return {
        activar(proyecto) { proyectoActual = proyecto; container?.classList.add('active'); if (searchInput) searchInput.disabled = false; if (uploadButton) uploadButton.disabled = false; limpiarArchivos(); },
        desactivar() { proyectoActual = null; container?.classList.remove('active'); if (searchInput) searchInput.disabled = true; if (uploadButton) uploadButton.disabled = true; limpiarArchivos(); },
        obtenerArchivos() { return [...archivosSeleccionados]; },
        obtenerProyecto() { return proyectoActual; },
        limpiar() { limpiarArchivos(); }
    };
}
