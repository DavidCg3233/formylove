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

function iniciarContador() {
  // Establecemos el objetivo: 25 de junio del año en curso a las 00:00:00
  const añoActual = new Date().getFullYear();
  const fechaObjetivo = new Date(`June 25, ${añoActual} 00:00:00`).getTime();

  // El intervalo se ejecuta cada 1 segundo
  const intervalo = setInterval(function() {
    const ahora = new Date().getTime();
    const distancia = fechaObjetivo - ahora;

    // Si ya llegamos al día y la hora
    if (distancia < 0) {
      clearInterval(intervalo);
      desbloquearBoton();
    } else {
      // Cálculos para obtener días, horas, minutos y segundos
      const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
      const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

      // Formatear para que siempre tenga 2 dígitos (ej. "05" en vez de "5")
      const d = dias.toString().padStart(2, '0');
      const h = horas.toString().padStart(2, '0');
      const m = minutos.toString().padStart(2, '0');
      const s = segundos.toString().padStart(2, '0');

      // Actualizamos el HTML
      const textoContador = document.getElementById("texto-contador");
      if (textoContador) {
        textoContador.innerHTML = `${d}d ${h}h ${m}m ${s}s`;
      }
    }
  }, 1000);
}

function desbloquearBoton() {
  const btn = document.getElementById("btn-contador");
  if(!btn) return;
  
  // Cambiamos textos principales
  document.getElementById("icono-reloj").innerHTML = "✨";
  document.getElementById("titulo-espera").innerHTML = "Llegó el <span>25 de junio</span>";
  
  // Verificamos si el subtítulo existe antes de intentar ocultarlo para que no haya error
  const subtitulo = document.getElementById("subtitulo-espera");
  if (subtitulo) {
    subtitulo.style.display = "none";
  }
  
  // Transformamos el cuadro del contador en el botón clickeable
  btn.className = "btn-yes"; 
  btn.style.cursor = "pointer";
  btn.style.border = "none";
  btn.style.background = "linear-gradient(135deg, var(--amber), var(--rust))";
  btn.style.padding = "1.2rem 3rem";
  btn.innerHTML = "<span style='font-size:1.2rem; font-weight:600;'>Descubrir Sorpresa ✨</span>";
  
  // Al hacer clic, arranca la animación de las flores y la carta
  btn.onclick = revelarSorpresa;
}

// Oculta el contador y muestra la carta con los cupones
// Función que controla la secuencia de la sorpresa
// Función que controla la secuencia de la sorpresa
function revelarSorpresa() {
  document.getElementById('pantalla-espera').style.display = 'none';
  document.getElementById('seccion-flores').style.display = 'flex';
  
  // Arranca la tortuga a dibujar
  dibujarFlorEstiloTurtle();
}

// La función que dibuja una flor real estilo Paint/Turtle
function dibujarFlorEstiloTurtle() {
  const canvas = document.getElementById('florCanvas');
  const ctx = canvas.getContext('2d');
  
  // Tamaño del lienzo
  canvas.width = 300;
  canvas.height = 300;

  // Estas son las "instrucciones de lápiz" (como la tortuga en Python)
  // Van desde un punto (x1, y1) hasta otro punto (x2, y2)
  const instrucciones = [
    // 1. Tallo (Verde) - De abajo hacia arriba
    { color: '#4CAF50', width: 6, x1: 150, y1: 280, x2: 150, y2: 120 },
    // 2. Hoja derecha (Verde)
    { color: '#4CAF50', width: 6, x1: 150, y1: 200, x2: 190, y2: 160 },
    { color: '#4CAF50', width: 6, x1: 190, y1: 160, x2: 150, y2: 180 },
    // 3. Hoja izquierda (Verde)
    { color: '#4CAF50', width: 6, x1: 150, y1: 230, x2: 110, y2: 190 },
    { color: '#4CAF50', width: 6, x1: 110, y1: 190, x2: 150, y2: 210 },
    // 4. Base del Tulipán (Naranja)
    { color: '#E8883A', width: 6, x1: 110, y1: 80, x2: 150, y2: 120 },
    { color: '#E8883A', width: 6, x1: 150, y1: 120, x2: 190, y2: 80 },
    // 5. Puntas del Tulipán (Naranja)
    { color: '#E8883A', width: 6, x1: 190, y1: 80, x2: 170, y2: 100 },
    { color: '#E8883A', width: 6, x1: 170, y1: 100, x2: 150, y2: 60 },
    { color: '#E8883A', width: 6, x1: 150, y1: 60, x2: 130, y2: 100 },
    { color: '#E8883A', width: 6, x1: 130, y1: 100, x2: 110, y2: 80 }
  ];

  let pasoActual = 0;
  let progreso = 0; // Va de 0 a 1 en cada línea

  function animarTrazo() {
    // Si ya dibujó todas las líneas, termina y baja a la carta
    if (pasoActual >= instrucciones.length) {
      document.getElementById('mensaje-te-amo').classList.add('visible');
      setTimeout(() => {
        const contenidoSorpresa = document.getElementById('contenido-sorpresa');
        contenidoSorpresa.style.display = 'flex';
        contenidoSorpresa.scrollIntoView({ behavior: 'smooth' });
      }, 2500);
      return;
    }

    // Limpia el lienzo en cada fotograma
    ctx.clearRect(0, 0, 300, 300);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 1. Dibuja todas las líneas anteriores que ya están terminadas
    for (let i = 0; i < pasoActual; i++) {
      let inst = instrucciones[i];
      ctx.strokeStyle = inst.color;
      ctx.lineWidth = inst.width;
      ctx.beginPath();
      ctx.moveTo(inst.x1, inst.y1);
      ctx.lineTo(inst.x2, inst.y2);
      ctx.stroke();
    }

    // 2. Dibuja la línea actual que se está animando
    let inst = instrucciones[pasoActual];
    let xActual = inst.x1 + (inst.x2 - inst.x1) * progreso;
    let yActual = inst.y1 + (inst.y2 - inst.y1) * progreso;

    ctx.strokeStyle = inst.color;
    ctx.lineWidth = inst.width;
    ctx.beginPath();
    ctx.moveTo(inst.x1, inst.y1);
    ctx.lineTo(xActual, yActual);
    ctx.stroke();

    // 3. Aumenta el progreso (Modifica este 0.05 para que sea más rápido o lento)
    progreso += 0.05; 

    // Cuando termina la línea, pasa a la siguiente instrucción
    if (progreso >= 1) {
      progreso = 0;
      pasoActual++;
    }

    // Pide dibujar el siguiente cuadro de la animación
    requestAnimationFrame(animarTrazo);
  }

  // Da la orden de empezar
  animarTrazo();
}

// Nueva Lógica de los cupones (Canje único y real)
function canjearCupon(elemento) {
  // Si el cupón ya tiene la clase 'canjeado', no hace nada
  if (elemento.classList.contains('canjeado')) {
    return; 
  }

  // Muestra una ventana de confirmación al estilo aplicación
  const confirmacion = confirm("⚠️ ¿Estás segura de que quieres usar este cupón ahora?\n\nRecuerda que solo puedes canjearlo una vez.");
  
  // Si ella le da a "Aceptar"
  if (confirmacion) {
    elemento.classList.add('canjeado');
    elemento.innerHTML = "<s>" + elemento.innerHTML + "</s> <br><span style='font-size: 0.9rem; color: #7A3B1E; margin-top: 0.8rem; display: block; font-weight: bold;'>¡Canjeado! ✔️</span>";
    
    // Un mensajito final para que sepa que ya te comprometiste jajaja
    setTimeout(() => {
      alert("¡Cupón redimido con éxito! Prepárate para disfrutarlo. 🥰");
    }, 300);
  }
}

// La función que se activa al tocar un cupón
function canjearCupon(elemento) {
  // Si ya está canjeado, no hace nada
  if (elemento.classList.contains('canjeado')) return; 

  const confirmacion = confirm("⚠️ ¿Estás segura de que quieres usar este cupón ahora?\n\nRecuerda que solo puedes canjearlo una vez.");
  
  if (confirmacion) {
    const nombreCupon = elemento.innerText;
    
    // Pon tu número aquí (ej: 573001234567)
    const tuNumero = "573233613652"; 
    
    // MAGIA AQUI: Guardamos en la "libreta" del navegador que este ID ya se usó
    localStorage.setItem(elemento.id, 'usado');

    // Cambiamos el diseño en vivo
    elemento.classList.add('canjeado');
    elemento.innerHTML = "<s>" + nombreCupon + "</s> <br><span style='font-size: 0.85rem; color: #555; margin-top: 0.5rem; display: block;'>(Redirigiendo a WhatsApp...)</span>";

    // Redirigimos a WhatsApp
    const mensaje = `¡Mi amor!  Quiero hacer válido este cupón:\n\n *${nombreCupon}*\n\n¿Cuándo me lo cumples? `;
    const url = `https://wa.me/${tuNumero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }
}

// NUEVA FUNCIÓN: Revisa la libreta al cargar la página y tacha los ya usados
function restaurarCupones() {
  const todosLosCupones = document.querySelectorAll('.cupon');
  
  todosLosCupones.forEach(cupon => {
    // Preguntamos a la libreta si el ID de este cupón dice "usado"
    if (localStorage.getItem(cupon.id) === 'usado') {
      const textoOriginal = cupon.innerText;
      cupon.classList.add('canjeado');
      cupon.innerHTML = "<s>" + textoOriginal + "</s> <br><span style='font-size: 0.85rem; color: #555; margin-top: 0.5rem; display: block;'>(Cupón ya utilizado ✔️)</span>";
    }
  });
}