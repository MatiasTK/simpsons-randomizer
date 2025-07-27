import { UIController } from './controllers/index.js';
import { AppState } from './models/index.js';
import { UIUtils } from './utils/index.js';

/**
 * Main application class
 */
export class SimpsonsApp {
  constructor() {
    this.appState = null;
    this.uiController = null;
    this.isInitialized = false;
  }

  /**
   * Initializes the application
   */
  async initialize() {
    try {
      // Initialize state management
      this.appState = new AppState();

      // Initialize UI controller
      this.uiController = new UIController(this.appState);

      // Mark as initialized
      this.isInitialized = true;

      console.log('Simpsons Randomizer initialized successfully');

      // Make app globally available for debugging (optional)
      this.exposeForDebugging();
    } catch (error) {
      console.error('Error initializing application:', error);
      UIUtils.showToast('Error al inicializar la aplicación');
      throw error;
    }
  }

  /**
   * Exposes app instance for debugging purposes
   */
  exposeForDebugging() {
    if (typeof window !== 'undefined') {
      window.simpsonsApp = {
        app: this,
        appState: this.appState,
        uiController: this.uiController,
      };
    }
  }

  /**
   * Gets the current app state
   * @returns {AppState} Current app state
   */
  getState() {
    return this.appState;
  }

  /**
   * Gets the UI controller
   * @returns {UIController} UI controller instance
   */
  getUIController() {
    return this.uiController;
  }

  /**
   * Checks if the app is initialized
   * @returns {boolean} Whether the app is initialized
   */
  isReady() {
    return this.isInitialized;
  }
}

/**
 * Application initialization function
 */
export async function initializeApp() {
  const app = new SimpsonsApp();
  await app.initialize();
  return app;
}
