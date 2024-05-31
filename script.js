function obtenerNumeroRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let fuente = 'simpsonslatino.online';

const getSimpsonsOnlineUrl = (season, episode) =>
  `https://simpsonslatino.online/episodes/los-simpson-${season}x${episode}/`;

const getSimpsonizadosUrl = (season, episode) =>
  `https://simpsonizados.me/capitulo/los-simpson-${season}x${episode}/`;

const botonEncontrarHandler = () => {
  const spinner = document.getElementById('spinner');
  const card = document.getElementById('card');
  if (spinner.classList.contains('visually-hidden')) {
    spinner.classList.remove('visually-hidden');
  }
  if (!card.classList.contains('visually-hidden-focusable')) {
    card.classList.add('visually-hidden-focusable');
  }

  const season = obtenerNumeroRandom(3, 34);
  const episode = obtenerNumeroRandom(1, 25);
  const proxy = 'https://proxy.cors.sh/';
  let link;
  if (fuente === 'simpsonslatino.online') {
    link = getSimpsonsOnlineUrl(season, episode);
  } else if (fuente === 'simpsonizados.me') {
    link = getSimpsonizadosUrl(season, episode);
  }

  fetch(proxy + link, {
    headers: {
      'x-cors-api-key': 'temp_af418191545e115fbeb6bc31c43c5565',
    },
  })
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
        return false;
      }

      if (card) {
        card.classList.remove('visually-hidden-focusable');
      }

      spinner.classList.add('visually-hidden');
      document.querySelector('.card-img-top').src = openGraphData['og:image'];
      document.querySelector('.card-title').textContent = openGraphData['og:title'];
      document.querySelector('.card-text').textContent = openGraphData['og:description'];
      document.getElementById('episodio-link').href = link;
    })
    .catch((error) => console.error('Error: ' + error));

  return true;
};

const botonEncontrar = document.getElementById('encontrar');
botonEncontrar.addEventListener('click', () => {
  let status;
  status = botonEncontrarHandler();
  while (!status) {
    status = botonEncontrarHandler();
    console.log(status);
  }
});

document.querySelectorAll('.source').forEach((item) => {
  item.addEventListener('click', (event) => {
    fuente = event.target.textContent;
  });
});
