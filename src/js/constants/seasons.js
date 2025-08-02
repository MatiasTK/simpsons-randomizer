// Cache for episodes data
let episodesCache = null;

/**
 * Fetches episodes data from the JSON file
 * @returns {Promise<Array>} Episodes data
 */
export async function fetchEpisodesData() {
  if (episodesCache) {
    return episodesCache;
  }

  try {
    const response = await fetch('/src/js/data/episodes.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    episodesCache = await response.json();
    SEASON_LIMITS.MAX = episodesCache.length;
    return episodesCache;
  } catch (error) {
    console.error('Error loading episodes data:', error);
    throw error;
  }
}

/**
 * Gets the episodes data
 * @returns {Promise<Array>} Episodes data
 */
export async function getEpisodesData() {
  return await fetchEpisodesData();
}

/**
 * Minimum and maximum season numbers
 */
export const SEASON_LIMITS = {
  MIN: 1,
  MAX: 34,
};
