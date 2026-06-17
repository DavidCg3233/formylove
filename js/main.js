// Función principal para cargar las vistas dinámicamente
function cargarSeccion(seccion) {
  const contenedor = document.getElementById('contenido-dinamico');

  // Hacemos la petición para traer el archivo HTML de la carpeta 'secciones'
  fetch(`secciones/${seccion}.html`)
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudo cargar la sección');
      }
      return response.text();
    })
    .then(html => {
      // 1. Inyectamos el HTML de la pestaña en el contenedor principal
      contenedor.innerHTML = html;

      // 2. Ejecutamos los scripts que vengan dentro de esa pestaña
      ejecutarScripts(contenedor);
    })
    .catch(error => {
      console.error('Error al cargar la sección:', error);
      // Mensaje de respaldo por si le das clic a una pestaña que aún no hemos creado
      contenedor.innerHTML = `
        <div style="text-align: center; padding: 5rem 1.5rem; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: calc(100vh - 60px);">
          <h2 style="font-family: 'Playfair Display', serif; font-size: 2.5rem; color: var(--cream);">¡Ups! 🚧</h2>
          <p style="color: var(--gold); margin-top: 1rem; font-size: 1.1rem; line-height: 1.6;">
            Esta sección ("${seccion}") todavía la estamos construyendo.<br>
            ¡Pronto estará lista para Arianna!
          </p>
        </div>
      `;
    });
}

// Función "mágica" para hacer que los <script> inyectados funcionen
function ejecutarScripts(elemento) {
  const scripts = elemento.querySelectorAll('script');
  scripts.forEach(oldScript => {
    const newScript = document.createElement('script');
    
    // Copiamos los atributos (si los tiene)
    Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
    
    // Copiamos el código de adentro
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    
    // Lo reemplazamos en la página para forzar al navegador a ejecutarlo
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}

// Esto hace que la sección "inicio" cargue automáticamente al abrir la página por primera vez
document.addEventListener('DOMContentLoaded', () => {
  cargarSeccion('inicio');
});