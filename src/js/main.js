import { initializeApp } from './app.js';

/**
 * Main entry point for the application
 */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('Starting Simpsons Randomizer...');

    // Initialize the application
    const app = await initializeApp();

    console.log('Application ready!');
  } catch (error) {
    console.error('Failed to initialize application:', error);
  }
});
