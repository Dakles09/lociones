/*
 * Este script se ejecuta una vez que todo el contenido del HTML ha sido cargado (DOMContentLoaded).
 * Se asegura de que todos los elementos existan antes de intentar manipularlos.
 */
document.addEventListener('DOMContentLoaded', function () {

    // --- TAREA 1: INICIALIZAR FEATHER ICONS ---
    // Reemplaza las etiquetas <i data-feather="..."> por los iconos SVG correspondientes.
    try {
        feather.replace();
    } catch (e) {
        console.error("Error al inicializar Feather Icons.", e);
    }

    // --- TAREA 2: ACTUALIZAR EL AÑO EN EL FOOTER ---
    // Busca el elemento con id="year" y le inserta el año actual.
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // --- TAREA 3: INICIALIZAR TOOLTIPS DE BOOTSTRAP ---
    // Busca todos los elementos con 'data-bs-toggle="tooltip"' y los activa.
    // Es necesario para que los tooltips (mensajes emergentes) en los iconos sociales funcionen.
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // --- TAREA 4: MEJORA DE UX - CERRAR NAVBAR AL HACER CLIC EN UN ENLACE ---
    // Cierra el menú de navegación móvil automáticamente después de hacer clic en un enlace.
    const mainNavbar = document.getElementById('mainNavbar');
    if (mainNavbar) {
        const navLinks = mainNavbar.querySelectorAll('.nav-link');
        const bsCollapse = new bootstrap.Collapse(mainNavbar, {
            toggle: false
        });

        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                // Solo intenta cerrar si el menú está visible (en modo móvil).
                if (bsCollapse._isShown()) {
                    bsCollapse.hide();
                }
            });
        });
    }

});