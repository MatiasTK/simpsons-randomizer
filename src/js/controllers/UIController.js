import { EpisodeService } from '../services/index.js';
import { ClipboardUtils, DOMUtils, UIUtils } from '../utils/index.js';

/**
 * UI Controller for managing user interface interactions
 */
export class UIController {
  constructor(appState) {
    this.appState = appState;
    this.hasEpisode = false;
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

    this.updateCopyButtonState(false);
  }

  /**
   * Binds event listeners
   */
  bindEvents() {
    this.bindFindEpisodeButton();
    this.bindSeasonInput();
    this.bindNewTabCheckbox();
    this.bindSourceSelection();
    this.bindShowMoreButton();
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
      temporadaInput.addEventListener('change', e => {
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
      nuevaPestanaCheckbox.addEventListener('change', e => {
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
    sourceItems.forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        this.appState.updateFuente(e.target.textContent);

        // Hide the episode card when source is changed
        this.hideEpisodeCard();
      });
    });
  }

  /**
   * Binds the show more button
   */
  bindShowMoreButton() {
    const showMoreBtn = DOMUtils.elements.showMoreBtn();
    if (showMoreBtn) {
      showMoreBtn.addEventListener('click', () => this.toggleDescription());
    }
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
      const episodeInfo = await EpisodeService.generateRandomEpisode(
        this.appState.fuente,
        this.appState.temporada
      );

      const episodeDataFromTMDB = await EpisodeService.fetchEpisodeDataFromTMDB(
        episodeInfo.episode,
        episodeInfo.season
      );

      if (episodeDataFromTMDB) {
        return this.displayEpisode(
          {
            ...episodeDataFromTMDB,
            season: episodeInfo.season,
            number: episodeInfo.episode,
          },
          episodeInfo.url,
          episodeDataFromTMDB.image
        );
      }

      const episodeData = await EpisodeService.fetchEpisodeData(
        episodeInfo.url
      );

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
  displayEpisode(episodeData, url, imageUrl = null) {
    const card = DOMUtils.elements.card();
    const cardImage = DOMUtils.elements.cardImage();
    const cardTitle = DOMUtils.elements.cardTitle();
    const cardText = DOMUtils.elements.cardText();
    const episodioLink = DOMUtils.elements.episodioLink();
    const copiarBtn = DOMUtils.elements.copiar();
    const cardSeason = DOMUtils.elements.cardSeason();
    const cardNumber = DOMUtils.elements.cardNumber();
    const showMoreBtn = DOMUtils.elements.showMoreBtn();

    // Show card
    DOMUtils.toggleElement(card, true);

    // Update content
    if (cardImage) cardImage.src = imageUrl || episodeData.image;
    if (cardTitle) cardTitle.textContent = episodeData.title;
    if (cardText) cardText.textContent = episodeData.description;
    if (episodioLink) episodioLink.href = url;
    if (cardSeason) cardSeason.textContent = episodeData.season;
    if (cardNumber) cardNumber.textContent = episodeData.number;

    // Reset description to truncated state
    if (cardText) {
      cardText.style.display = '-webkit-box';
      cardText.style.webkitLineClamp = '3';
      cardText.style.lineClamp = '3';
      cardText.style.webkitBoxOrient = 'vertical';
      cardText.style.textOverflow = 'ellipsis';
    }

    // Show/hide "Mostrar más" button based on text overflow
    if (showMoreBtn && cardText) {
      // Check if text is truncated (scrollHeight > clientHeight)
      setTimeout(() => {
        const isTruncated = cardText.scrollHeight > cardText.clientHeight;
        if (isTruncated) {
          showMoreBtn.classList.remove('visually-hidden');
          showMoreBtn.textContent = 'Mostrar más';
          showMoreBtn.setAttribute(
            'aria-label',
            'Mostrar más texto de la descripción'
          );
        } else {
          showMoreBtn.classList.add('visually-hidden');
        }
      }, 0);
    }

    // Enable copy button and set up functionality
    this.updateCopyButtonState(true);
    this.setupCopyButton(copiarBtn, url);

    this.hasEpisode = true;
  }

  /**
   * Hides the episode card
   */
  hideEpisodeCard() {
    const card = DOMUtils.elements.card();
    const spinner = DOMUtils.elements.spinner();

    // Hide card and spinner
    DOMUtils.toggleElement(card, false);
    DOMUtils.toggleElement(spinner, false);

    this.updateCopyButtonState(false);
    this.hasEpisode = false;
  }

  /**
   * Updates the copy button state
   * @param {boolean} enabled - Whether the button should be enabled
   */
  updateCopyButtonState(enabled) {
    const copiarBtn = DOMUtils.elements.copiar();
    if (!copiarBtn) return;

    if (enabled) {
      copiarBtn.disabled = false;
      copiarBtn.classList.remove('btn-secondary', 'disabled');
      copiarBtn.classList.add('btn-secondary');
      copiarBtn.setAttribute('aria-label', 'Copiar enlace del episodio');
    } else {
      copiarBtn.disabled = true;
      copiarBtn.classList.remove('btn-secondary');
      copiarBtn.classList.add('btn-secondary', 'disabled');
      copiarBtn.setAttribute('aria-label', 'No hay episodio para copiar');
    }
  }

  /**
   * Sets up the copy button functionality
   * @param {HTMLElement} copiarBtn - Copy button element
   * @param {string} url - URL to copy
   */
  setupCopyButton(copiarBtn, url) {
    if (!copiarBtn || !this.hasEpisode) return;

    // Remove existing listeners to prevent duplicates
    const newCopiarBtn = copiarBtn.cloneNode(true);
    copiarBtn.parentNode.replaceChild(newCopiarBtn, copiarBtn);

    newCopiarBtn.addEventListener('click', async () => {
      if (!this.hasEpisode) return;

      const success = await ClipboardUtils.copyToClipboard(url);
      if (success) {
        UIUtils.showToast('Enlace copiado al portapapeles');
      } else {
        UIUtils.showToast('Error al copiar el enlace');
      }
    });
  }

  /**
   * Toggles the description between truncated and full view
   */
  toggleDescription() {
    const cardText = DOMUtils.elements.cardText();
    const showMoreBtn = DOMUtils.elements.showMoreBtn();

    if (!cardText || !showMoreBtn) return;

    const isExpanded = cardText.style.display === 'block';

    if (isExpanded) {
      // Collapse the text
      cardText.style.display = '-webkit-box';
      cardText.style.webkitLineClamp = '3';
      cardText.style.lineClamp = '3';
      cardText.style.webkitBoxOrient = 'vertical';
      cardText.style.textOverflow = 'ellipsis';
      showMoreBtn.textContent = 'Mostrar más';
      showMoreBtn.setAttribute(
        'aria-label',
        'Mostrar más texto de la descripción'
      );
    } else {
      // Expand the text
      cardText.style.display = 'block';
      cardText.style.webkitLineClamp = 'unset';
      cardText.style.lineClamp = 'unset';
      cardText.style.webkitBoxOrient = 'unset';
      cardText.style.textOverflow = 'unset';
      showMoreBtn.textContent = 'Mostrar menos';
      showMoreBtn.setAttribute(
        'aria-label',
        'Mostrar menos texto de la descripción'
      );
    }
  }
}
