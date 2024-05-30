function obtenerNumeroRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let fuente = 'simpsonslatino.online';

const getSimpsonsOnlineUrl = (season, episode) =>
  `https://simpsonslatino.online/episodes/los-simpson-${season}x${episode}/`;

const getSimpsonizadosUrl = (season, episode) =>
  `https://simpsonizados.me/capitulo/los-simpson-${season}x${episode}/`;

const botonEncontrar = document.getElementById('encontrar');
botonEncontrar.addEventListener('click', () => {
  const season = obtenerNumeroRandom(3, 34);
  const episode = obtenerNumeroRandom(1, 25);
  const proxy = 'https://corsproxy.io/?';
  let link;
  if (fuente === 'simpsonslatino.online') {
    link = getSimpsonsOnlineUrl(season, episode);
  } else if (fuente === 'simpsonizados.me') {
    link = getSimpsonizadosUrl(season, episode);
  }

  // Fetch the HTML of the page
  fetch(proxy + link, {
    mode: 'cors',
  })
    .then((response) => response.text())
    .then((html) => {
      // Parse the HTML with a DOM parser
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Extract the Open Graph meta tags
      const metaTags = Array.from(doc.getElementsByTagName('meta'));
      const openGraphData = metaTags.reduce((data, tag) => {
        if (tag.getAttribute('property') && tag.getAttribute('property').startsWith('og:')) {
          data[tag.getAttribute('property')] = tag.getAttribute('content');
        }
        return data;
      }, {});

      const hidden = document.querySelector('.visually-hidden');
      if (hidden) {
        hidden.classList.remove('visually-hidden');
      }
      document.querySelector('.card-img-top').src = openGraphData['og:image'];
      document.querySelector('.card-title').textContent = openGraphData['og:title'];
      document.querySelector('.card-text').textContent = openGraphData['og:description'];
      document.getElementById('episodio-link').href = link;
    })
    .catch((error) => console.error('Error:', error));
});

document.querySelectorAll('.source').forEach((item) => {
  item.addEventListener('click', (event) => {
    fuente = event.target.textContent;
  });
});
