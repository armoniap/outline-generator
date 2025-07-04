import { semanticAnalyzer } from '../services/semanticAnalyzer.js';
import { generateSubheadingSuggestion } from '../api/openrouter.js';
import { getScoreColorClass, formatScore } from '../utils/math.js';
import { fadeIn, showLoading, hideLoading, showError, showSuccess } from '../utils/ui.js';

export function showPhase3(outlineText, topic) {
    const phase3Section = document.getElementById('phase3Section');
    if (phase3Section) {
        phase3Section.classList.remove('hidden');
        fadeIn(phase3Section);
        
        // Scroll to Phase 3
        phase3Section.scrollIntoView({ behavior: 'smooth' });
        
        // Store outline and topic for later use
        phase3Section.dataset.outlineText = outlineText;
        phase3Section.dataset.topic = topic;
        
        // Setup Phase 3 event listeners
        setupPhase3EventListeners();
    }
}

function setupPhase3EventListeners() {
    const startAnalysisBtn = document.getElementById('startSemanticAnalysisBtn');
    const copyFinalBtn = document.getElementById('copyFinalOutlineBtn');
    
    if (startAnalysisBtn) {
        startAnalysisBtn.addEventListener('click', handleStartSemanticAnalysis);
    }
    
    if (copyFinalBtn) {
        copyFinalBtn.addEventListener('click', copyFinalOutline);
    }
}

async function handleStartSemanticAnalysis() {
    try {
        const geminiApiKey = document.getElementById('geminiApiKey').value.trim();
        const openrouterApiKey = document.getElementById('openrouterApiKey').value.trim();
        const phase3Section = document.getElementById('phase3Section');
        const outlineText = phase3Section.dataset.outlineText;
        const topic = phase3Section.dataset.topic;
        
        if (!geminiApiKey) {
            showError('API key di Google Gemini richiesta per l\'analisi semantica.');
            return;
        }
        
        if (!openrouterApiKey) {
            showError('API key di OpenRouter richiesta per i suggerimenti AI.');
            return;
        }
        
        if (!outlineText || !topic) {
            showError('Nessuna outline trovata. Completa prima la Fase 2.');
            return;
        }
        
        showLoading('Analizzando coerenza semantica...');
        
        // Set up the semantic analyzer
        semanticAnalyzer.setApiKeys(geminiApiKey, openrouterApiKey);
        
        // Get semantic terms from previous analysis
        const selectedData = window.outlineGenerator?.getSelectedData();
        if (selectedData?.semanticAnalysis) {
            semanticAnalyzer.setSemanticTerms(selectedData.semanticAnalysis);
        }
        
        // Run semantic analysis
        const results = await semanticAnalyzer.analyzeOutlineSemanticCoherence(topic, outlineText);
        
        // Display results
        displaySemanticAnalysisResults(results);
        
        hideLoading();
        showSuccess('Analisi semantica completata con successo!');
        
    } catch (error) {
        hideLoading();
        showError(`Errore durante l'analisi semantica: ${error.message}`);
        console.error('Semantic analysis error:', error);
    }
}

function displaySemanticAnalysisResults(results) {
    const resultsSection = document.getElementById('semanticAnalysisResults');
    if (!resultsSection) return;
    
    // Show results section
    resultsSection.classList.remove('hidden');
    fadeIn(resultsSection);
    
    // Update overall score
    updateOverallScore(results.statistics);
    
    // Update score distribution
    updateScoreDistribution(results.statistics.scoreDistribution);
    
    // Create interactive editor
    createInteractiveEditor(results.headings);
}

function updateOverallScore(statistics) {
    const overallScoreEl = document.getElementById('overallScore');
    if (overallScoreEl) {
        const colorClass = getScoreColorClass(statistics.overallLevel);
        overallScoreEl.className = `px-3 py-1 rounded-full text-sm font-medium ${colorClass}`;
        overallScoreEl.textContent = `Punteggio Complessivo: ${formatScore(statistics.overallScore)}`;
    }
}

function updateScoreDistribution(distribution) {
    const elements = {
        excellentCount: document.getElementById('excellentCount'),
        goodCount: document.getElementById('goodCount'),
        fairCount: document.getElementById('fairCount'),
        poorCount: document.getElementById('poorCount')
    };
    
    if (elements.excellentCount) elements.excellentCount.textContent = distribution.excellent;
    if (elements.goodCount) elements.goodCount.textContent = distribution.good;
    if (elements.fairCount) elements.fairCount.textContent = distribution.fair;
    if (elements.poorCount) elements.poorCount.textContent = distribution.poor;
}

function createInteractiveEditor(headings) {
    const editorContainer = document.getElementById('interactiveOutlineEditor');
    if (!editorContainer) return;
    
    editorContainer.innerHTML = '';
    
    headings.forEach((heading, index) => {
        const headingElement = createEditableHeadingElement(heading, index);
        editorContainer.appendChild(headingElement);
    });
}

function createEditableHeadingElement(heading, index) {
    const div = document.createElement('div');
    div.className = 'bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600';
    div.dataset.headingId = heading.id;
    
    const colorClass = getScoreColorClass(heading.scoreLevel);
    
    div.innerHTML = `
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2">
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400">${heading.level}</span>
                <span class="px-2 py-1 text-xs rounded-full ${colorClass}">
                    ${formatScore(heading.score)}
                </span>
            </div>
            <div class="flex items-center space-x-2">
                <button class="ai-suggest-btn bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded transition-colors" data-heading-id="${heading.id}">
                    🤖 Suggerimento AI
                </button>
                <button class="edit-btn bg-gray-500 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded transition-colors" data-heading-id="${heading.id}">
                    ✏️ Modifica
                </button>
                <button class="delete-btn bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded transition-colors" data-heading-id="${heading.id}">
                    🗑️ Elimina
                </button>
            </div>
        </div>
        <div class="heading-content">
            <div class="heading-display font-medium text-gray-900 dark:text-white">
                ${heading.text}
            </div>
            <div class="heading-edit hidden">
                <input type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white" value="${heading.text}">
                <div class="flex justify-end space-x-2 mt-2">
                    <button class="cancel-edit-btn bg-gray-500 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded transition-colors">
                        Annulla
                    </button>
                    <button class="confirm-edit-btn bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded transition-colors">
                        Conferma
                    </button>
                </div>
            </div>
        </div>
        <div class="score-change-indicator mt-2 hidden">
            <!-- Score change will be shown here -->
        </div>
    `;
    
    // Add event listeners
    setupHeadingEventListeners(div, heading);
    
    return div;
}

function setupHeadingEventListeners(element, heading) {
    const aiSuggestBtn = element.querySelector('.ai-suggest-btn');
    const editBtn = element.querySelector('.edit-btn');
    const deleteBtn = element.querySelector('.delete-btn');
    const cancelBtn = element.querySelector('.cancel-edit-btn');
    const confirmBtn = element.querySelector('.confirm-edit-btn');
    const input = element.querySelector('input');
    
    if (aiSuggestBtn) {
        aiSuggestBtn.addEventListener('click', () => handleAISuggestion(heading.id));
    }
    
    if (editBtn) {
        editBtn.addEventListener('click', () => enterEditMode(element));
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => handleDeleteHeading(heading.id, element));
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => exitEditMode(element));
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => confirmEdit(element, heading.id));
    }
    
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                confirmEdit(element, heading.id);
            } else if (e.key === 'Escape') {
                exitEditMode(element);
            }
        });
    }
}

function enterEditMode(element) {
    const display = element.querySelector('.heading-display');
    const edit = element.querySelector('.heading-edit');
    
    if (display && edit) {
        display.classList.add('hidden');
        edit.classList.remove('hidden');
        
        const input = edit.querySelector('input');
        if (input) {
            input.focus();
            input.select();
        }
    }
}

function exitEditMode(element) {
    const display = element.querySelector('.heading-display');
    const edit = element.querySelector('.heading-edit');
    
    if (display && edit) {
        display.classList.remove('hidden');
        edit.classList.add('hidden');
    }
}

async function confirmEdit(element, headingId) {
    const input = element.querySelector('input');
    if (!input) return;
    
    const newText = input.value.trim();
    if (!newText) {
        showError('Il testo del subheading non può essere vuoto.');
        return;
    }
    
    try {
        showLoading('Ricalcolando punteggio...');
        
        // Recalculate score
        const result = await semanticAnalyzer.recalculateHeadingScore(headingId, newText);
        
        // Update display
        updateHeadingDisplay(element, newText, result);
        
        // Exit edit mode
        exitEditMode(element);
        
        // Update overall statistics
        updateOverallStatistics();
        
        hideLoading();
        
        // Show score change
        showScoreChange(element, result);
        
    } catch (error) {
        hideLoading();
        showError(`Errore durante il ricalcolo: ${error.message}`);
        console.error('Recalculation error:', error);
    }
}

function updateHeadingDisplay(element, newText, result) {
    const display = element.querySelector('.heading-display');
    const scoreEl = element.querySelector('.px-2.py-1');
    
    if (display) {
        display.textContent = newText;
    }
    
    if (scoreEl) {
        const colorClass = getScoreColorClass(result.scoreLevel);
        scoreEl.className = `px-2 py-1 text-xs rounded-full ${colorClass}`;
        scoreEl.textContent = formatScore(result.score);
    }
}

function showScoreChange(element, result) {
    const indicator = element.querySelector('.score-change-indicator');
    if (!indicator || result.improvement === null) return;
    
    const improvement = result.improvement;
    const isImprovement = improvement > 0;
    const changeText = isImprovement ? 
        `+${formatScore(Math.abs(improvement))}` : 
        `-${formatScore(Math.abs(improvement))}`;
    
    const colorClass = isImprovement ? 
        'text-green-600 dark:text-green-400' : 
        'text-red-600 dark:text-red-400';
    
    indicator.innerHTML = `
        <div class="text-xs ${colorClass}">
            ${isImprovement ? '📈' : '📉'} ${changeText}
        </div>
    `;
    
    indicator.classList.remove('hidden');
    
    // Hide after 3 seconds
    setTimeout(() => {
        indicator.classList.add('hidden');
    }, 3000);
}

async function handleAISuggestion(headingId) {
    try {
        showLoading('Generando suggerimento AI...');
        
        const suggestion = await semanticAnalyzer.generateAISuggestion(headingId);
        
        hideLoading();
        
        // Show suggestion modal
        showSuggestionModal(headingId, suggestion);
        
    } catch (error) {
        hideLoading();
        showError(`Errore durante la generazione del suggerimento: ${error.message}`);
        console.error('AI suggestion error:', error);
    }
}

function showSuggestionModal(headingId, suggestion) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    overlay.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg mx-4 w-full">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🤖 Suggerimento AI Ottimizzato
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Questo suggerimento è stato ottimizzato per massimizzare la coerenza semantica e spiegare chiaramente cosa verrà trattato nel paragrafo:
            </p>
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 p-4 rounded-lg mb-4 border-l-4 border-blue-500">
                <p class="text-blue-800 dark:text-blue-200 font-medium">${suggestion}</p>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mb-4">
                💡 Il suggerimento integra termini semantici rilevanti e rende il titolo più descrittivo e coinvolgente
            </div>
            <div class="flex justify-end space-x-3">
                <button class="cancel-suggestion bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors">
                    Annulla
                </button>
                <button class="apply-suggestion bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded transition-colors">
                    Applica Suggerimento
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners
    const cancelBtn = overlay.querySelector('.cancel-suggestion');
    const applyBtn = overlay.querySelector('.apply-suggestion');
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
    }
    
    if (applyBtn) {
        applyBtn.addEventListener('click', async () => {
            document.body.removeChild(overlay);
            await applySuggestion(headingId, suggestion);
        });
    }
    
    // Close on backdrop click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
    
    document.body.appendChild(overlay);
}

async function applySuggestion(headingId, suggestion) {
    const element = document.querySelector(`[data-heading-id="${headingId}"]`);
    if (!element) return;
    
    const input = element.querySelector('input');
    if (input) {
        input.value = suggestion;
        await confirmEdit(element, headingId);
    }
}

function updateOverallStatistics() {
    const statistics = semanticAnalyzer.getUpdatedStatistics();
    updateOverallScore(statistics);
    updateScoreDistribution(statistics.scoreDistribution);
}

function handleDeleteHeading(headingId, element) {
    // Show confirmation modal
    showDeleteConfirmationModal(headingId, element);
}

function showDeleteConfirmationModal(headingId, element) {
    const heading = semanticAnalyzer.headings.find(h => h.id === headingId);
    if (!heading) return;
    
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    overlay.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 w-full">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🗑️ Conferma Eliminazione
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
                Sei sicuro di voler eliminare questo subheading?
            </p>
            <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-4">
                <p class="text-sm font-medium text-gray-900 dark:text-white">${heading.level}: ${heading.text}</p>
            </div>
            <div class="flex justify-end space-x-3">
                <button class="cancel-delete bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors">
                    Annulla
                </button>
                <button class="confirm-delete bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors">
                    Elimina
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners
    const cancelBtn = overlay.querySelector('.cancel-delete');
    const confirmBtn = overlay.querySelector('.confirm-delete');
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
            confirmDeleteHeading(headingId, element);
        });
    }
    
    // Close on backdrop click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
    
    document.body.appendChild(overlay);
}

function confirmDeleteHeading(headingId, element) {
    try {
        // Remove from semanticAnalyzer
        const index = semanticAnalyzer.headings.findIndex(h => h.id === headingId);
        if (index >= 0) {
            semanticAnalyzer.headings.splice(index, 1);
        }
        
        // Remove from DOM
        element.remove();
        
        // Update statistics
        updateOverallStatistics();
        
        showSuccess('Subheading eliminato con successo!');
        
    } catch (error) {
        showError(`Errore durante l'eliminazione: ${error.message}`);
        console.error('Delete error:', error);
    }
}

function copyFinalOutline() {
    try {
        const finalOutline = semanticAnalyzer.getCurrentOutlineText();
        
        navigator.clipboard.writeText(finalOutline).then(() => {
            showSuccess('Outline finale copiata in formato Markdown!');
            
            // Visual feedback on button
            const copyBtn = document.getElementById('copyFinalOutlineBtn');
            if (copyBtn) {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '✅ Copiato!';
                copyBtn.classList.add('bg-green-700');
                copyBtn.classList.remove('bg-green-600');
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.classList.remove('bg-green-700');
                    copyBtn.classList.add('bg-green-600');
                }, 2000);
            }
        }).catch(err => {
            console.error('Error copying to clipboard:', err);
            showError('Errore durante la copia negli appunti.');
        });
    } catch (error) {
        showError('Nessuna outline modificata da copiare.');
        console.error('Copy error:', error);
    }
}