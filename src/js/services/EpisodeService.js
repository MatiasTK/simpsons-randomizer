import { PROVIDERS, PROXY_ENDPOINT } from '../constants/index.js';
import { fetchEpisodesData } from '../constants/seasons.js';
import { UIUtils } from '../utils/index.js';

/**
 * Service for episode-related operations
 */
export class EpisodeService {
  /**
   * Fetches episode data from a URL
   * @param {string} url - URL to fetch
   * @returns {Promise<Object|null>} Episode data or null if not found
   */
  static async fetchEpisodeData(url) {
    try {
      const encodedUrl = encodeURIComponent(url);
      const response = await fetch(PROXY_ENDPOINT + encodedUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      return this.parseEpisodeData(html);
    } catch (error) {
      console.error('Error fetching episode data:', error);
      return null;
    }
  }

  /**
   * Fetches episode data from TMDB
   * @param {number} episode - Episode number
   * @param {number} season - Season number
   * @returns {Promise<Object|null>} Episode data or null if not found
   */
  static async fetchEpisodeDataFromTMDB(episode, season) {
    const episodesData = await fetchEpisodesData();
    const episodeData = episodesData[season - 1].episodes[episode - 1];

    if (!episodeData) {
      return null;
    }

    return episodeData;
  }

  /**
   * Parses HTML to extract Open Graph data
   * @param {string} html - HTML content
   * @returns {Object|null} Parsed episode data or null if invalid
   */
  static parseEpisodeData(html) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const metaTags = Array.from(doc.getElementsByTagName('meta'));
      const openGraphData = metaTags.reduce((data, tag) => {
        const property = tag.getAttribute('property');
        const content = tag.getAttribute('content');

        if (property && property.startsWith('og:') && content) {
          data[property] = content;
        }
        return data;
      }, {});

      // Validate required data
      if (
        !openGraphData['og:image'] ||
        !openGraphData['og:title'] ||
        openGraphData['og:title'].includes('no se encuentra')
      ) {
        return null;
      }

      return {
        image: openGraphData['og:image'],
        title: openGraphData['og:title'],
        description: openGraphData['og:description'] || '',
      };
    } catch (error) {
      console.error('Error parsing episode data:', error);
      return null;
    }
  }

  /**
   * Generates a random episode URL
   * @param {string} fuente - Provider source
   * @param {number} maxSeason - Maximum season to include
   * @returns {Promise<Object>} Episode information
   */
  static async generateRandomEpisode(fuente, maxSeason) {
    const episodesData = await fetchEpisodesData();
    const seasons = episodesData.map(episode => episode.season);
    const availableSeasons = seasons.filter(season => season <= maxSeason);

    if (availableSeasons.length === 0) {
      throw new Error('No seasons available for the specified range');
    }

    const season =
      availableSeasons[Math.floor(Math.random() * availableSeasons.length)];
    const episode = UIUtils.getRandomNumber(
      1,
      episodesData[season - 1].quantity
    );
    const url = PROVIDERS[fuente](season, episode);

    return {
      season,
      episode,
      url,
    };
  }

  /**
   * Validates episode data
   * @param {Object} episodeData - Episode data to validate
   * @returns {boolean} Whether the data is valid
   */
  static isValidEpisodeData(episodeData) {
    return (
      episodeData &&
      episodeData.image &&
      episodeData.title &&
      !episodeData.title.includes('no se encuentra')
    );
  }
}
