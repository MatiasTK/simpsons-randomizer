import { EpisodeService } from '../services/index.js';
import { ClipboardUtils, DOMUtils, UIUtils } from '../utils/index.js';

/**
 * UI Controller for managing user interface interactions
 */
export class UIController {
  constructor(appState) {
    this.appState = appState;
    this.initializeUI();
    this.bindEvents();
  }

  /**
   * Initializes UI with current state
   */
  initializeUI() {
    const { temporada, nuevaPestana } = this.appState;

    // Set form values
    const temporadaInput = DOMUtils.elements.temporadaInput();
    const nuevaPestanaCheckbox = DOMUtils.elements.nuevaPestana();
    const episodioLink = DOMUtils.elements.episodioLink();

    if (temporadaInput) {
      temporadaInput.value = temporada;
    }
    if (nuevaPestanaCheckbox) {
      nuevaPestanaCheckbox.checked = nuevaPestana;
    }
    if (episodioLink) {
      episodioLink.target = nuevaPestana ? '_blank' : '_self';
    }
  }

  /**
   * Binds event listeners
   */
  bindEvents() {
    this.bindFindEpisodeButton();
    this.bindSeasonInput();
    this.bindNewTabCheckbox();
    this.bindSourceSelection();
  }

  /**
   * Binds the find episode button
   */
  bindFindEpisodeButton() {
    const encontrarBtn = DOMUtils.elements.encontrar();
    if (encontrarBtn) {
      encontrarBtn.addEventListener('click', () => this.handleFindEpisode());
    }
  }

  /**
   * Binds the season input
   */
  bindSeasonInput() {
    const temporadaInput = DOMUtils.elements.temporadaInput();
    if (temporadaInput) {
      temporadaInput.addEventListener('change', (e) => {
        this.appState.updateTemporada(parseInt(e.target.value, 10));
      });
    }
  }

  /**
   * Binds the new tab checkbox
   */
  bindNewTabCheckbox() {
    const nuevaPestanaCheckbox = DOMUtils.elements.nuevaPestana();
    if (nuevaPestanaCheckbox) {
      nuevaPestanaCheckbox.addEventListener('change', (e) => {
        this.appState.updateNuevaPestana(e.target.checked);
        const episodioLink = DOMUtils.elements.episodioLink();
        if (episodioLink) {
          episodioLink.target = e.target.checked ? '_blank' : '_self';
        }
      });
    }
  }

  /**
   * Binds source selection
   */
  bindSourceSelection() {
    const sourceItems = DOMUtils.elements.sourceItems();
    sourceItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.appState.updateFuente(e.target.textContent);
      });
    });
  }

  /**
   * Handles the find episode action
   */
  async handleFindEpisode() {
    const spinner = DOMUtils.elements.spinner();
    const card = DOMUtils.elements.card();

    // Show loading state
    DOMUtils.toggleElement(spinner, true);
    DOMUtils.toggleElement(card, false);

    try {
      const episodeInfo = EpisodeService.generateRandomEpisode(
        this.appState.fuente,
        this.appState.temporada
      );

      const episodeData = await EpisodeService.fetchEpisodeData(episodeInfo.url);

      if (!EpisodeService.isValidEpisodeData(episodeData)) {
        throw new Error('Episode not found');
      }

      this.displayEpisode(episodeData, episodeInfo.url);
    } catch (error) {
      console.error('Error finding episode:', error);
      UIUtils.showToast('No se encontró el episodio, intenta de nuevo');
    } finally {
      DOMUtils.toggleElement(spinner, false);
    }
  }

  /**
   * Displays episode information in the UI
   * @param {Object} episodeData - Episode data
   * @param {string} url - Episode URL
   */
  displayEpisode(episodeData, url) {
    const card = DOMUtils.elements.card();
    const cardImage = DOMUtils.elements.cardImage();
    const cardTitle = DOMUtils.elements.cardTitle();
    const cardText = DOMUtils.elements.cardText();
    const episodioLink = DOMUtils.elements.episodioLink();
    const copiarBtn = DOMUtils.elements.copiar();

    // Show card
    DOMUtils.toggleElement(card, true);

    // Update content
    if (cardImage) cardImage.src = episodeData.image;
    if (cardTitle) cardTitle.textContent = episodeData.title;
    if (cardText) cardText.textContent = episodeData.description;
    if (episodioLink) episodioLink.href = url;

    // Set up copy button
    this.setupCopyButton(copiarBtn, url);
  }

  /**
   * Sets up the copy button functionality
   * @param {HTMLElement} copiarBtn - Copy button element
   * @param {string} url - URL to copy
   */
  setupCopyButton(copiarBtn, url) {
    if (!copiarBtn) return;

    // Remove existing listeners to prevent duplicates
    const newCopiarBtn = copiarBtn.cloneNode(true);
    copiarBtn.parentNode.replaceChild(newCopiarBtn, copiarBtn);

    newCopiarBtn.addEventListener('click', async () => {
      const success = await ClipboardUtils.copyToClipboard(url);
      if (success) {
        UIUtils.showToast('Enlace copiado al portapapeles');
      } else {
        UIUtils.showToast('Error al copiar el enlace');
      }
    });
  }
}
