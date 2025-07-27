import { DOMUtils } from './dom.js';

/**
 * UI utility functions
 */
export class UIUtils {
  /**
   * Shows a toast notification
   * @param {string} message - Message to display
   */
  static showToast(message) {
    const toast = DOMUtils.elements.fuenteToast();
    if (!toast) return;

    try {
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);
      const toastBody = toast.querySelector('.toast-body');
      if (toastBody) {
        toastBody.textContent = message;
      }
      toastBootstrap.show();
    } catch (error) {
      console.error('Error showing toast:', error);
    }
  }

  /**
   * Generates a random number between min and max (inclusive)
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random number
   */
  static getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Validates if a value is within a range
   * @param {number} value - Value to validate
   * @param {number} min - Minimum allowed value
   * @param {number} max - Maximum allowed value
   * @returns {boolean} Whether the value is valid
   */
  static isValidRange(value, min, max) {
    return value >= min && value <= max;
  }

  /**
   * Debounces a function call
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}
