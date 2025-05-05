const carpeta = 'repertorio/';
const obras = ['dichterliebe.txt']; // Añadir más según crezcas

let movimientos = [];
let traducciones = [];
let movimientoActual = 0;
let videoBase = '';

function inicializar() {
  const lista = document.getElementById('listaObras');
  obras.forEach(nombre => {
    const b = document.createElement('button');
    const titulo = nombre.replace('.txt', '');
    b.textContent = titulo;
    b.onclick = () => seleccionarObra(nombre);
    lista.appendChild(b);
  });

  document.getElementById('btnObra').onclick = volverASeleccion;
  document.getElementById('btnToggleVideo').onclick = toggleVideo;
  document.getElementById('btnTraduccion').onclick = toggleTraduccion;
  document.getElementById('btnAnterior').onclick = () => cambiarMovimiento(-1);
  document.getElementById('btnSiguiente').onclick = () => cambiarMovimiento(1);
}

function volverASeleccion() {
  document.getElementById('app').style.display = 'none';
  document.getElementById('selectorObra').style.display = 'block';
}

async function seleccionarObra(nombreArchivo) {
  const texto = await fetch(carpeta + nombreArchivo).then(r => r.text());
  const lineas = texto.split('\n');

  movimientos = [];
  traducciones = [];
  videoBase = '';
  let buffer = [], traduc = [], titulo = null;

  lineas.forEach(l => {
    if (l.startsWith('// youtube:')) {
      videoBase = l.replace('// youtube:', '').trim();
    } else if (l.startsWith('##')) {
      if (titulo) {
        movimientos.push({ titulo, texto: buffer.join('\n'), traduccion: traduc.join('\n') });
      }
      titulo = l.replace('##', '').trim();
      buffer = [];
      traduc = [];
    } else if (l.includes('::')) {
      const [o, t] = l.split('::');
      buffer.push(o.trim());
      traduc.push(t.trim());
    } else if (!l.startsWith('//')) {
      buffer.push(l.trim());
      traduc.push('');
    }
  });

  if (titulo) {
    movimientos.push({ titulo, texto: buffer.join('\n'), traduccion: traduc.join('\n') });
  }

  movimientoActual = 0;
  document.getElementById('selectorObra').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  mostrarBotonesMovimientos();
  mostrarMovimiento();
}

function mostrarBotonesMovimientos() {
  const cont = document.getElementById('botonesMovimientos');
  cont.innerHTML = '';
  movimientos.forEach((m, i) => {
    const b = document.createElement('button');
    b.textContent = romano(i + 1);
    b.onclick = () => {
      movimientoActual = i;
      mostrarMovimiento();
    };
    cont.appendChild(b);
  });
}

function mostrarMovimiento() {
  const m = movimientos[movimientoActual];
  document.getElementById('textoOriginal').textContent = m.texto;
  document.getElementById('textoTraduccion').textContent = m.traduccion;
  document.getElementById('textoTraduccion').style.display = 'none';

  if (videoBase) {
    document.getElementById('youtube').src = videoBase;
  }
}

function cambiarMovimiento(d) {
  const nuevo = movimientoActual + d;
  if (nuevo >= 0 && nuevo < movimientos.length) {
    movimientoActual = nuevo;
    mostrarMovimiento();
  }
}

function toggleVideo() {
  const v = document.getElementById('video');
  v.style.display = v.style.display === 'none' ? 'block' : 'none';
}

function toggleTraduccion() {
  const t = document.getElementById('textoTraduccion');
  t.style.display = t.style.display === 'none' ? 'block' : 'none';
}

function romano(n) {
  const r = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI'];
  return r[n - 1] || n;
}

inicializar();