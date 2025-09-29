/**
 * Application configuration constants
 */
export const STORAGE_KEYS = {
  FUENTE: 'fuente',
  TEMPORADA: 'temporada',
  NUEVA_PESTANA: 'nueva-pestana',
};

export const DEFAULT_SETTINGS = {
  fuente: 'simpsonslatino.online',
  temporada: 10,
  nuevaPestana: false,
};

export const PROXY_ENDPOINT = '/.netlify/edge-functions/proxy?url=';

/**
 * DOM element selectors
 */
export const DOM_SELECTORS = {
  spinner: '#spinner',
  card: '#card',
  temporadaInput: '#temporadaInput',
  nuevaPestana: '#nueva-pestana',
  episodioLink: '#episodio-link',
  stremioLink: '#stremio-link',
  copiar: '#copiar',
  fuenteToast: '#fuenteToast',
  encontrar: '#encontrar',
  sourceItems: '.source',
  cardImage: '.card-img-top',
  cardTitle: '.card-title',
  cardText: '.card-text',
};
