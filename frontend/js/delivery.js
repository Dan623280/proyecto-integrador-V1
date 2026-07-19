export function iniciarEntregaArchivos() {
    const container = document.getElementById(
        'file-delivery-container'
    );

    const searchInput = document.getElementById(
        'file-search-input'
    );

    const suggestions = document.getElementById(
        'search-suggestions'
    );

    const uploadButton = document.getElementById(
        'btn-upload-trigger'
    );

    const fileInput = document.getElementById(
        'real-file-input'
    );

    const selectedBadge = document.getElementById(
        'selected-file-badge'
    );

    const selectedName = document.getElementById(
        'selected-file-name'
    );

    const removeButton = document.getElementById(
        'btn-remove-file'
    );

    const deliverButton = document.getElementById(
        'btn-entregar'
    );

    let proyectoActual = null;
    let archivoSeleccionado = null;

    function seleccionarArchivo(nombre) {
        archivoSeleccionado = nombre;

        if (selectedName) {
            selectedName.textContent = nombre;
        }

        if (selectedBadge) {
            selectedBadge.classList.remove('hidden');
        }

        if (deliverButton) {
            deliverButton.disabled = false;
        }

        if (suggestions) {
            suggestions.classList.add('hidden');
        }

        if (searchInput) {
            searchInput.value = '';
        }
    }

    function quitarArchivo() {
        archivoSeleccionado = null;

        if (selectedBadge) {
            selectedBadge.classList.add('hidden');
        }

        if (deliverButton) {
            deliverButton.disabled = true;
        }

        if (fileInput) {
            fileInput.value = '';
        }
    }

    function mostrarSugerencias(archivos) {
        if (!suggestions) {
            return;
        }

        if (archivos.length === 0) {
            suggestions.innerHTML = `
                <div class="suggestion-item">
                    No se encontraron archivos
                </div>
            `;

            suggestions.classList.remove('hidden');

            return;
        }

        suggestions.innerHTML = archivos
            .map((archivo) => {
                return `
                    <div
                        class="suggestion-item"
                        data-file="${archivo}"
                    >
                        <span>${archivo}</span>
                        <span>Sugerido</span>
                    </div>
                `;
            })
            .join('');

        suggestions.classList.remove('hidden');

        suggestions
            .querySelectorAll('.suggestion-item')
            .forEach((item) => {
                item.addEventListener('click', () => {
                    seleccionarArchivo(
                        item.dataset.file
                    );
                });
            });
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const texto = searchInput.value
                .trim()
                .toLowerCase();

            if (
                !texto ||
                !proyectoActual
            ) {
                suggestions.classList.add('hidden');

                return;
            }

            const resultados =
                proyectoActual.archivos.filter(
                    (archivo) =>
                        archivo
                            .toLowerCase()
                            .includes(texto)
                );

            mostrarSugerencias(resultados);
        });

        searchInput.addEventListener('focus', () => {
            if (
                proyectoActual &&
                proyectoActual.archivos
            ) {
                mostrarSugerencias(
                    proyectoActual.archivos
                );
            }
        });
    }

    if (uploadButton && fileInput) {
        uploadButton.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                seleccionarArchivo(
                    fileInput.files[0].name
                );
            }
        });
    }

    if (removeButton) {
        removeButton.addEventListener('click', () => {
            quitarArchivo();
        });
    }

    document.addEventListener('click', (event) => {
        if (
            suggestions &&
            !suggestions.contains(event.target) &&
            event.target !== searchInput
        ) {
            suggestions.classList.add('hidden');
        }
    });

    return {
        activar(proyecto) {
            proyectoActual = proyecto;

            if (container) {
                container.classList.add('active');
            }

            if (searchInput) {
                searchInput.disabled = false;
            }

            if (uploadButton) {
                uploadButton.disabled = false;
            }

            quitarArchivo();
        },

        desactivar() {
            if (container) {
                container.classList.remove('active');
            }

            if (searchInput) {
                searchInput.disabled = true;
            }

            if (uploadButton) {
                uploadButton.disabled = true;
            }

            quitarArchivo();
        },

        obtenerArchivo() {
            return archivoSeleccionado;
        },

        limpiar() {
            quitarArchivo();
        }
    };
}