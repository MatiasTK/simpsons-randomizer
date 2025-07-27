import { PROVIDERS, PROXY_ENDPOINT, SEASONS } from '../constants/index.js';
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
   * @returns {Object} Episode information
   */
  static generateRandomEpisode(fuente, maxSeason) {
    const season = UIUtils.getRandomNumber(1, maxSeason);
    const episode = UIUtils.getRandomNumber(1, SEASONS[season]);
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
