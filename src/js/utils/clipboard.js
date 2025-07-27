/**
 * Clipboard utility functions
 */
export class ClipboardUtils {
  /**
   * Copies text to clipboard using modern API with fallback
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>} Success status
   */
  static async copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        return this.copyToClipboardFallback(text);
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  }

  /**
   * Fallback clipboard method for older browsers
   * @param {string} text - Text to copy
   * @returns {boolean} Success status
   */
  static copyToClipboardFallback(text) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-999999px';
      textarea.style.top = '-999999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand('copy');
      textarea.remove();
      return success;
    } catch (error) {
      console.error('Error in clipboard fallback:', error);
      return false;
    }
  }
}
