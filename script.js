const carpeta = 'repertorio/';
const obras = ['dichterliebe.txt']; // Añade aquí más archivos si los vas incluyendo

let obraActual = null;
let videoBase = '';
let movimientos = [];

async function cargarObra(nombreArchivo) {
  const texto = await fetch(carpeta + nombreArchivo).then(r => r.text());
  const lineas = texto.split('\n');
  videoBase = '';
  movimientos = [];

  let buffer = [], movimiento = null;
  lineas.forEach(l => {
    if (l.startsWith('// youtube:')) {
      videoBase = l.replace('// youtube:', '').trim();
    } else if (l.startsWith('##')) {
      if (movimiento) {
        movimientos.push({ titulo: movimiento, contenido: buffer });
      }
      movimiento = l.replace('##', '').trim();
      buffer = [];
    } else {
      buffer.push(l);
    }
  });
  if (movimiento) {
    movimientos.push({ titulo: movimiento, contenido: buffer });
  }

  document.getElementById('movimientos').innerHTML = '';
  movimientos.forEach((m, i) => {
    const b = document.createElement('button');
    b.textContent = m.titulo;
    b.onclick = () => mostrarMovimiento(i);
    document.getElementById('movimientos').appendChild(b);
  });

  document.getElementById('texto').innerHTML = '';
  document.getElementById('youtube').src = '';
  document.getElementById('video').style.display = 'none';
}

function mostrarMovimiento(i) {
  const m = movimientos[i];
  const contenedor = document.getElementById('texto');
  contenedor.innerHTML = '';
  let start = 0;

  m.content = m.contenido.filter(l => {
    if (l.startsWith('// start:')) {
      start = parseInt(l.replace('// start:', '').trim());
      return false;
    }
    return true;
  });

  if (videoBase) {
    const src = videoBase + (start ? `?start=${start}` : '');
    document.getElementById('youtube').src = src;
  }

  m.content.forEach(l => {
    if (!l.trim() || l.startsWith('//')) return;
    const partes = l.split('::');
    const div = document.createElement('div');
    div.className = 'verso';
    div.textContent = partes[0].trim();
    if (partes[1]) {
      const trad = document.createElement('div');
      trad.className = 'traduccion';
      trad.textContent = partes[1].trim();
      div.onclick = () => trad.style.display = trad.style.display === 'none' ? 'block' : 'none';
      div.appendChild(trad);
    }
    contenedor.appendChild(div);
  });
}

function toggleVideo() {
  const v = document.getElementById('video');
  v.style.display = v.style.display === 'none' ? 'block' : 'none';
}

// Inicializar lista de obras
const divObras = document.getElementById('obras');
obras.forEach(nombre => {
  const b = document.createElement('button');
  const titulo = nombre.replace('.txt', '');
  b.textContent = titulo;
  b.onclick = () => {
    obraActual = nombre;
    cargarObra(nombre);
  };
  divObras.appendChild(b);
});
