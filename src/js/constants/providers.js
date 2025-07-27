/**
 * Provider URL generators for different streaming sources
 */
export const PROVIDERS = {
  'simpsonslatino.online': (season, episode) =>
    `https://simpsonslatino.online/capitulo/los-simpson-${season}x${episode}/`,
  'simpsonizados.me': (season, episode) =>
    `https://simpsonizados.me/cap/los-simpson-${season}x${episode}/`,
  'simpsonhd.com': (season, episode) =>
    `https://simpsonhd.com/episodios/los-simpson-${season}x${episode}/`,
  'pelisplus.to': (season, episode) =>
    `https://ww3.pelisplus.to/serie/los-simpson/season/${season}/episode/${episode}`,
};

/**
 * Available provider names
 */
export const PROVIDER_NAMES = Object.keys(PROVIDERS);

/**
 * Default provider
 */
export const DEFAULT_PROVIDER = 'simpsonslatino.online';
