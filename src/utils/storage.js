export function loadSavedApiKeys() {
    const openrouterApiKey = localStorage.getItem('openrouter_api_key');
    const geminiApiKey = localStorage.getItem('gemini_api_key');
    
    const openrouterInput = document.getElementById('openrouterApiKey');
    if (openrouterApiKey && openrouterInput) {
        openrouterInput.value = openrouterApiKey;
    }
    
    const geminiInput = document.getElementById('geminiApiKey');
    if (geminiApiKey && geminiInput) {
        geminiInput.value = geminiApiKey;
    }
}

export function saveApiKey(type, key) {
    if (key.trim()) {
        localStorage.setItem(`${type}_api_key`, key);
    }
}

export function getApiKey(type) {
    return localStorage.getItem(`${type}_api_key`);
}

export function saveOutline(outline) {
    localStorage.setItem('saved_outline', JSON.stringify(outline));
}

export function loadSavedOutline() {
    const saved = localStorage.getItem('saved_outline');
    return saved ? JSON.parse(saved) : null;
}

export function saveAnalysisResults(results) {
    localStorage.setItem('analysis_results', JSON.stringify(results));
}

export function loadAnalysisResults() {
    const saved = localStorage.getItem('analysis_results');
    return saved ? JSON.parse(saved) : null;
}