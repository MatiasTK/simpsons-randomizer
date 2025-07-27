const SEASONS = {
  1: 13,
  2: 22,
  3: 24,
  4: 22,
  5: 22,
  6: 25,
  7: 25,
  8: 25,
  9: 25,
  10: 23,
  11: 22,
  12: 21,
  13: 22,
  14: 22,
  15: 22,
  16: 21,
  17: 22,
  18: 22,
  19: 20,
  20: 21,
  21: 23,
  22: 22,
  23: 22,
  24: 22,
  25: 22,
  26: 22,
  27: 22,
  28: 21,
  29: 21,
  30: 23,
  31: 22,
  32: 22,
  33: 22,
  34: 22,
};

const getSimpsonsOnlineUrl = (season, episode) =>
  `https://simpsonslatino.online/capitulo/los-simpson-${season}x${episode}/`;

const getSimpsonizadosUrl = (season, episode) =>
  `https://simpsonizados.me/cap/los-simpson-${season}x${episode}/`;

const getSimpsonsHdUrl = (season, episode) =>
  `https://simpsonhd.com/episodios/los-simpson-${season}x${episode}/`;

const getPelisPlusUrl = (season, episode) =>
  `https://ww3.pelisplus.to/serie/los-simpson/season/${season}/episode/${episode}`;

const PROVIDERS = {
  'simpsonslatino.online': getSimpsonsOnlineUrl,
  'simpsonizados.me': getSimpsonizadosUrl,
  'simpsonhd.com': getSimpsonsHdUrl,
  'pelisplus.to': getPelisPlusUrl,
};

function saveToLocalStorage() {
  localStorage.setItem('fuente', fuente);
  localStorage.setItem('temporada', document.getElementById('temporadaInput').value);
  localStorage.setItem('nueva-pestana', document.getElementById('nueva-pestana').checked);
}

let fuente = 'simpsonslatino.online';

function obtenerNumeroRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function copyToClipboard(text) {
  var textarea = document.createElement('textarea');
  textarea.textContent = text;
  document.body.appendChild(textarea);

  var selection = document.getSelection();
  var savedRanges = [];
  for (let i = 0; i < selection.rangeCount; i++) {
    savedRanges[i] = selection.getRangeAt(i).cloneRange();
  }
  selection.removeAllRanges();
  textarea.select();
  document.execCommand('copy');

  selection.removeAllRanges();
  for (let i = 0; i < savedRanges.length; i++) {
    selection.addRange(savedRanges[i]);
  }

  document.body.removeChild(textarea);
  showToast('Enlace copiado al portapapeles');
}

function showToast(text) {
  const toast = document.getElementById('fuenteToast');
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);
  toast.querySelector('.toast-body').textContent = text;
  toastBootstrap.show();
}

const botonEncontrarHandler = () => {
  const spinner = document.getElementById('spinner');
  const card = document.getElementById('card');
  if (spinner.classList.contains('visually-hidden')) {
    spinner.classList.remove('visually-hidden');
  }
  if (!card.classList.contains('visually-hidden-focusable')) {
    card.classList.add('visually-hidden-focusable');
  }

  const seasonMax = document.getElementById('temporadaInput').value;
  const season = obtenerNumeroRandom(1, seasonMax);
  const episode = obtenerNumeroRandom(1, SEASONS[season]);
  const proxy = '/.netlify/edge-functions/proxy?url=';
  const link = PROVIDERS[fuente](season, episode);
  const encodedLink = encodeURIComponent(link);

  return new Promise((resolve) => {
    fetch(proxy + encodedLink)
      .then((response) => response.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const metaTags = Array.from(doc.getElementsByTagName('meta'));
        const openGraphData = metaTags.reduce((data, tag) => {
          if (tag.getAttribute('property') && tag.getAttribute('property').startsWith('og:')) {
            data[tag.getAttribute('property')] = tag.getAttribute('content');
          }
          return data;
        }, {});

        if (!openGraphData['og:image'] || openGraphData['og:title'].includes('no se encuentra')) {
          resolve(false);
        }

        if (card) {
          card.classList.remove('visually-hidden-focusable');
        }

        spinner.classList.add('visually-hidden');
        document.querySelector('.card-img-top').src = openGraphData['og:image'];
        document.querySelector('.card-title').textContent = openGraphData['og:title'];
        document.querySelector('.card-text').textContent = openGraphData['og:description'];
        document.getElementById('episodio-link').href = link;
        document.getElementById('copiar').addEventListener('click', () => {
          copyToClipboard(link);
        });

        resolve(true);
      })
      .catch((error) => {
        console.error('Error: ' + error);
        resolve(false);
      });
  });
};

document.getElementById('temporadaInput').addEventListener('change', () => {
  saveToLocalStorage();
});

document.addEventListener('DOMContentLoaded', () => {
  const fuenteLocal = localStorage.getItem('fuente');
  const temporadaLocal = localStorage.getItem('temporada');
  const nuevaPestanaLocal = localStorage.getItem('nueva-pestana');
  if (temporadaLocal) {
    document.getElementById('temporadaInput').value = temporadaLocal;
  }
  if (fuenteLocal) {
    fuente = fuenteLocal;
  }
  if (nuevaPestanaLocal) {
    document.getElementById('nueva-pestana').checked = nuevaPestanaLocal === 'true';
    document.getElementById('episodio-link').target =
      nuevaPestanaLocal === 'true' ? '_blank' : '_self';
  }
});

const botonEncontrar = document.getElementById('encontrar');
botonEncontrar.addEventListener('click', () => {
  botonEncontrarHandler().then((isOk) => {
    if (!isOk) {
      document.getElementById('spinner').classList.add('visually-hidden');
      showToast('No se encontró el episodio, intenta de nuevo');
    }
  });
});

document.getElementById('nueva-pestana').addEventListener('change', (e) => {
  saveToLocalStorage();
  document.getElementById('episodio-link').target = e.target.checked ? '_blank' : '_self';
});

document.querySelectorAll('.source').forEach((item) => {
  item.addEventListener('click', (event) => {
    fuente = event.target.textContent;
    saveToLocalStorage();
    showToast(`Fuente seleccionada: ${fuente}`);
  });
});
