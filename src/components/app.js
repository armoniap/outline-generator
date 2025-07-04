import { loadSavedApiKeys } from '../utils/storage.js';

export function initializeApp() {
    // Load saved API keys
    loadSavedApiKeys();
    
    console.log('✅ AI Outline Generator inizializzato');
}