export function validateForm() {
    const openrouterApiKey = document.getElementById('openrouterApiKey').value.trim();
    const topic = document.getElementById('topicInput').value.trim();
    
    const isValidOpenrouterKey = openrouterApiKey.length >= 20;
    const isValidTopic = topic.length >= 3 && topic.length <= 100;
    
    const isValid = isValidOpenrouterKey && isValidTopic;
    
    const generateBtn = document.getElementById('generateBtn');
    const helpElement = document.getElementById('generateHelp');
    
    if (generateBtn) {
        generateBtn.disabled = !isValid;
    }
    
    // Update help text
    let helpText = '';
    if (!isValidOpenrouterKey) {
        helpText = 'API key OpenRouter è richiesta (almeno 20 caratteri).';
    } else if (!isValidTopic) {
        helpText = 'Argomento richiesto (3-100 caratteri).';
    }
    
    if (helpElement) {
        if (isValid) {
            helpElement.classList.add('hidden');
        } else {
            helpElement.textContent = helpText;
            helpElement.classList.remove('hidden');
        }
    }
    
    // Update input validation styles
    updateInputValidation(document.getElementById('openrouterApiKey'), isValidOpenrouterKey);
    updateInputValidation(document.getElementById('topicInput'), isValidTopic);
    
    return isValid;
}

function updateInputValidation(input, isValid) {
    if (!input) return;
    
    input.classList.remove('border-red-500', 'border-green-500', 'border-gray-300', 'dark:border-gray-600');
    
    if (input.value.trim() === '') {
        input.classList.add('border-gray-300', 'dark:border-gray-600');
    } else if (isValid) {
        input.classList.add('border-green-500');
    } else {
        input.classList.add('border-red-500');
    }
}

export function validateApiKey(apiKey, type = 'openrouter') {
    if (!apiKey || typeof apiKey !== 'string') {
        return false;
    }
    
    if (type === 'openrouter') {
        return apiKey.length >= 20;
    }
    
    return false;
}