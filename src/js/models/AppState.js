import {
  DEFAULT_SETTINGS,
  PROVIDERS,
  STORAGE_KEYS,
} from '../constants/index.js';
import { UIUtils } from '../utils/index.js';

/**
 * Application state management class
 */
export class AppState {
  constructor() {
    this.fuente = DEFAULT_SETTINGS.fuente;
    this.temporada = DEFAULT_SETTINGS.temporada;
    this.nuevaPestana = DEFAULT_SETTINGS.nuevaPestana;
    this.loadSettings();
  }

  /**
   * Loads settings from localStorage
   */
  loadSettings() {
    try {
      const fuenteLocal = localStorage.getItem(STORAGE_KEYS.FUENTE);
      const temporadaLocal = localStorage.getItem(STORAGE_KEYS.TEMPORADA);
      const nuevaPestanaLocal = localStorage.getItem(
        STORAGE_KEYS.NUEVA_PESTANA
      );

      if (fuenteLocal && PROVIDERS[fuenteLocal]) {
        this.fuente = fuenteLocal;
      }
      if (temporadaLocal) {
        const temp = parseInt(temporadaLocal, 10);
        if (UIUtils.isValidRange(temp, 1, 34)) {
          this.temporada = temp;
        }
      }
      if (nuevaPestanaLocal !== null) {
        this.nuevaPestana = nuevaPestanaLocal === 'true';
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  /**
   * Saves current settings to localStorage
   */
  saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEYS.FUENTE, this.fuente);
      localStorage.setItem(STORAGE_KEYS.TEMPORADA, this.temporada.toString());
      localStorage.setItem(
        STORAGE_KEYS.NUEVA_PESTANA,
        this.nuevaPestana.toString()
      );
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  /**
   * Updates fuente and saves to storage
   * @param {string} newFuente - New fuente value
   */
  updateFuente(newFuente) {
    if (PROVIDERS[newFuente]) {
      this.fuente = newFuente;
      this.saveSettings();
      UIUtils.showToast(`Fuente seleccionada: ${newFuente}`);
    }
  }

  /**
   * Updates temporada and saves to storage
   * @param {number} newTemporada - New temporada value
   */
  updateTemporada(newTemporada) {
    if (UIUtils.isValidRange(newTemporada, 1, 34)) {
      this.temporada = newTemporada;
      this.saveSettings();
    }
  }

  /**
   * Updates nuevaPestana and saves to storage
   * @param {boolean} newNuevaPestana - New nuevaPestana value
   */
  updateNuevaPestana(newNuevaPestana) {
    this.nuevaPestana = newNuevaPestana;
    this.saveSettings();
  }

  /**
   * Gets current state as an object
   * @returns {Object} Current state
   */
  getState() {
    return {
      fuente: this.fuente,
      temporada: this.temporada,
      nuevaPestana: this.nuevaPestana,
    };
  }
}
