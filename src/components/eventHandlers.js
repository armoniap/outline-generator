import { validateForm } from '../utils/validation.js';
import { saveApiKey } from '../utils/storage.js';
import { outlineGenerator } from '../services/outlineGenerator.js';
import { testOpenRouterApiKey } from '../api/openrouter.js';
import { showLoading, hideLoading, showError, showSuccess } from '../utils/ui.js';
import { renderResults, setupSelectionControls } from './resultsRenderer.js';

export function setupEventListeners() {
    // API Key visibility toggles
    setupApiKeyToggles();
    
    // Form validation
    setupFormValidation();
    
    // Main action buttons
    setupGenerationButtons();
    
    // Progress tracking
    setupProgressTracking();
    
    // Selection controls
    setupSelectionControls();
}

function setupApiKeyToggles() {
    const toggleOpenrouterBtn = document.getElementById('toggleOpenrouterApiKey');
    
    if (toggleOpenrouterBtn) {
        toggleOpenrouterBtn.addEventListener('click', () => {
            toggleApiKeyVisibility('openrouterApiKey', 'openrouterEyeIcon');
        });
    }
}

function toggleApiKeyVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    
    if (!input || !icon) return;
    
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    
    icon.innerHTML = isPassword 
        ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />`
        : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />`;
}

function setupFormValidation() {
    const inputs = [
        'openrouterApiKey', 
        'topicInput'
    ];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', () => {
                if (inputId.includes('ApiKey')) {
                    const type = inputId.replace('ApiKey', '');
                    saveApiKey(type, input.value);
                }
                // Call validation on next tick to ensure DOM is ready
                setTimeout(() => validateGenerationForm(), 0);
            });
        }
    });
}

function setupGenerationButtons() {
    const generateBtn = document.getElementById('generateBtn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', handleGenerateOutline);
    }
}

async function handleGenerateOutline() {
    try {
        const openrouterApiKey = document.getElementById('openrouterApiKey').value.trim();
        const topic = document.getElementById('topicInput').value.trim();
        
        if (!validateGenerationForm()) {
            return;
        }
        
        // Skip API key test for now and proceed directly
        console.log('Skipping API key validation, proceeding with generation...');
        
        // Start generation process
        const results = await outlineGenerator.generateCompleteOutline(openrouterApiKey, topic);
        
        // Render results
        renderResults(results);
        
        hideLoading();
        showSuccess('Generazione completata con successo!');
        
    } catch (error) {
        hideLoading();
        showError(`Errore durante la generazione: ${error.message}`);
        console.error('Generation error:', error);
    }
}

function setupProgressTracking() {
    // Setup progress callback
    outlineGenerator.setProgressCallback((step, message) => {
        updateProgressStep(step, message);
    });
    
    // Setup status callback
    outlineGenerator.setStatusCallback((message) => {
        updateStatusMessage(message);
    });
}

function updateProgressStep(step, message) {
    const progressSection = document.getElementById('progressSection');
    const stepElement = document.getElementById(`step${step}`);
    
    if (progressSection) {
        progressSection.classList.remove('hidden');
    }
    
    if (stepElement) {
        const circle = stepElement.querySelector('.w-4.h-4.rounded-full');
        const text = stepElement.querySelector('span');
        
        if (circle) {
            circle.className = 'w-4 h-4 rounded-full bg-blue-500';
        }
        
        if (text) {
            text.textContent = message;
            text.className = 'text-sm font-medium text-blue-600 dark:text-blue-400';
        }
        
        // Mark previous steps as completed
        for (let i = 1; i < step; i++) {
            const prevStep = document.getElementById(`step${i}`);
            if (prevStep) {
                const prevCircle = prevStep.querySelector('.w-4.h-4.rounded-full');
                if (prevCircle) {
                    prevCircle.className = 'w-4 h-4 rounded-full bg-green-500';
                }
                const prevText = prevStep.querySelector('span');
                if (prevText) {
                    prevText.className = 'text-sm text-green-600 dark:text-green-400';
                }
            }
        }
    }
}

function updateStatusMessage(message) {
    const statusMessage = document.getElementById('statusMessage');
    if (statusMessage) {
        statusMessage.textContent = message;
    }
}

function validateGenerationForm() {
    const openrouterApiKey = document.getElementById('openrouterApiKey').value.trim();
    const topic = document.getElementById('topicInput').value.trim();
    const generateBtn = document.getElementById('generateBtn');
    const generateHelp = document.getElementById('generateHelp');
    
    let isValid = true;
    let errorMessage = '';
    
    if (!openrouterApiKey) {
        isValid = false;
        errorMessage = 'Inserisci la tua API key di OpenRouter';
    } else if (!topic) {
        isValid = false;
        errorMessage = 'Inserisci un argomento/topic da analizzare';
    } else if (topic.length < 3) {
        isValid = false;
        errorMessage = 'L\'argomento deve essere di almeno 3 caratteri';
    }
    
    if (generateBtn) {
        generateBtn.disabled = !isValid;
    }
    
    if (generateHelp) {
        if (errorMessage) {
            generateHelp.textContent = errorMessage;
            generateHelp.classList.remove('hidden');
        } else {
            generateHelp.classList.add('hidden');
        }
    }
    
    return isValid;
}