/**
 * DOM utility functions
 */
export class DOMUtils {
  /**
   * Gets a DOM element by selector
   * @param {string} selector - CSS selector
   * @returns {HTMLElement|null} DOM element or null if not found
   */
  static getElement(selector) {
    return document.querySelector(selector);
  }

  /**
   * Gets a DOM element by ID
   * @param {string} id - Element ID
   * @returns {HTMLElement|null} DOM element or null if not found
   */
  static getElementById(id) {
    return document.getElementById(id);
  }

  /**
   * Gets all DOM elements matching a selector
   * @param {string} selector - CSS selector
   * @returns {NodeList} NodeList of matching elements
   */
  static getElements(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Toggles visibility of an element
   * @param {HTMLElement} element - Element to toggle
   * @param {boolean} show - Whether to show or hide
   */
  static toggleElement(element, show) {
    if (!element) return;

    if (show) {
      element.classList.remove('visually-hidden', 'visually-hidden-focusable');
    } else {
      element.classList.add('visually-hidden', 'visually-hidden-focusable');
    }
  }

  /**
   * Query selector
   * @param {string} selector - CSS selector
   * @returns {HTMLElement|null} DOM element or null if not found
   */
  static querySelector(selector) {
    return document.querySelector(selector);
  }

  /**
   * Centralized DOM element access
   */
  static elements = {
    spinner: () => DOMUtils.getElementById('spinner'),
    card: () => DOMUtils.getElementById('card'),
    temporadaInput: () => DOMUtils.getElementById('temporadaInput'),
    nuevaPestana: () => DOMUtils.getElementById('nueva-pestana'),
    episodioLink: () => DOMUtils.getElementById('episodio-link'),
    copiar: () => DOMUtils.getElementById('copiar'),
    fuenteToast: () => DOMUtils.getElementById('fuenteToast'),
    encontrar: () => DOMUtils.getElementById('encontrar'),
    sourceItems: () => DOMUtils.getElements('.source'),
    cardImage: () => DOMUtils.querySelector('.card-img-top'),
    cardTitle: () => DOMUtils.querySelector('.card-title'),
    cardText: () => DOMUtils.querySelector('.card-text'),
    cardSeason: () => DOMUtils.querySelector('#episode-season'),
    cardNumber: () => DOMUtils.querySelector('#episode-number'),
    showMoreBtn: () => DOMUtils.getElementById('show-more-btn'),
  };
}
