import './styles.css';
import { initializeApp } from './components/app.js';
import { setupDarkMode } from './utils/darkMode.js';
import { setupEventListeners } from './components/eventHandlers.js';
import { outlineGenerator } from './services/outlineGenerator.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize application
    initializeApp();
    
    // Setup dark mode
    setupDarkMode();
    
    // Setup event listeners
    setupEventListeners();
    
    // Make outlineGenerator globally accessible for Phase 3
    window.outlineGenerator = outlineGenerator;
    
    // Remove loading class
    document.body.classList.add('loaded');
});