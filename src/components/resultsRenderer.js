import { fadeIn, showLoading, hideLoading, showError, showSuccess } from '../utils/ui.js';
import { outlineGenerator } from '../services/outlineGenerator.js';
import { showPhase3 } from './semanticEditor.js';

export function renderResults(results) {
    renderCompetitorOutlines(results.competitorOutlines);
    renderSemanticAnalysis(results.semanticAnalysis);
    renderAspectsToTreat(results.aspectsToTreat);
    updateStatistics();
    showResultsSection();
}

function showResultsSection() {
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
        resultsSection.classList.remove('hidden');
        fadeIn(resultsSection);
    }
}

function renderCompetitorOutlines(competitorOutlines) {
    const competitorSection = document.getElementById('competitorSection');
    const competitorOutlinesDiv = document.getElementById('competitorOutlines');
    
    if (!competitorSection || !competitorOutlinesDiv || !competitorOutlines) return;
    
    competitorOutlinesDiv.innerHTML = '';
    
    competitorOutlines.forEach((competitor, index) => {
        const competitorDiv = document.createElement('div');
        competitorDiv.className = 'competitor-outline-item border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4';
        
        const header = document.createElement('div');
        header.className = 'flex items-center justify-between mb-3';
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'flex-1';
        
        const title = document.createElement('h3');
        title.className = 'font-semibold text-gray-900 dark:text-white text-sm';
        title.textContent = competitor.title || `Competitor ${index + 1}`;
        
        const url = document.createElement('a');
        url.className = 'text-xs text-blue-600 dark:text-blue-400 hover:underline';
        url.href = competitor.url;
        url.target = '_blank';
        url.textContent = competitor.url;
        
        titleDiv.appendChild(title);
        titleDiv.appendChild(url);
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `competitor-${index}`;
        checkbox.checked = outlineGenerator.results.selectedElements.competitors.has(index);
        checkbox.className = 'ml-4';
        checkbox.addEventListener('change', () => {
            outlineGenerator.toggleCompetitorSelection(index);
            updateStatistics();
        });
        
        header.appendChild(titleDiv);
        header.appendChild(checkbox);
        
        const outlineDiv = document.createElement('div');
        outlineDiv.className = 'outline-content bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm font-mono whitespace-pre-line';
        outlineDiv.textContent = competitor.outline || 'Nessuna outline estratta';
        
        competitorDiv.appendChild(header);
        competitorDiv.appendChild(outlineDiv);
        competitorOutlinesDiv.appendChild(competitorDiv);
    });
}

function renderSemanticAnalysis(semanticAnalysis) {
    const semanticSection = document.getElementById('semanticSection');
    const semanticAnalysisDiv = document.getElementById('semanticAnalysis');
    
    if (!semanticSection || !semanticAnalysisDiv || !semanticAnalysis) return;
    
    semanticAnalysisDiv.innerHTML = '';
    
    // Render each section of semantic analysis
    renderSemanticSection('Entità Principali', semanticAnalysis.salientEntities, 'salient', semanticAnalysisDiv);
    renderSemanticSection('Sinonimi', semanticAnalysis.synonyms, 'synonym', semanticAnalysisDiv);
    
    // Render categories
    if (semanticAnalysis.categories) {
        Object.keys(semanticAnalysis.categories).forEach(categoryKey => {
            const category = semanticAnalysis.categories[categoryKey];
            renderSemanticCategory(categoryKey, category, semanticAnalysisDiv);
        });
    }
    
    // Render other semantic elements
    renderSemanticSection('Relazioni Tutto-Parte', semanticAnalysis.partWholeRelationships, 'partWholeRelationships', semanticAnalysisDiv);
    renderSemanticSection('Collocazioni Comuni', semanticAnalysis.commonCollocations, 'commonCollocations', semanticAnalysisDiv);
    renderSemanticSection('Affermazioni Correlate', semanticAnalysis.relatedStatements, 'relatedStatements', semanticAnalysisDiv);
    renderSemanticSection('Domande Correlate', semanticAnalysis.relatedQuestions, 'relatedQuestions', semanticAnalysisDiv);
    renderSemanticSection('Errori Comuni', semanticAnalysis.commonErrors, 'commonErrors', semanticAnalysisDiv);
    renderSemanticSection('Dibattiti Attuali', semanticAnalysis.currentDebates, 'currentDebates', semanticAnalysisDiv);
}

function renderSemanticSection(title, items, prefix, container) {
    if (!items || !Array.isArray(items) || items.length === 0) return;
    
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'semantic-section mb-6';
    
    const titleEl = document.createElement('h4');
    titleEl.className = 'font-semibold text-gray-900 dark:text-white mb-3';
    titleEl.textContent = title;
    
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'flex flex-wrap gap-2';
    
    items.forEach((item, index) => {
        const itemEl = document.createElement('span');
        itemEl.className = 'semantic-item px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm cursor-pointer border border-transparent hover:border-blue-300';
        itemEl.textContent = item;
        itemEl.dataset.elementId = `${prefix}_${index}`;
        
        const isSelected = outlineGenerator.results.selectedElements.semanticElements.has(`${prefix}_${index}`);
        if (isSelected) {
            itemEl.classList.add('selected');
            itemEl.classList.add('bg-green-100', 'dark:bg-green-900', 'text-green-800', 'dark:text-green-200');
            itemEl.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'text-blue-800', 'dark:text-blue-200');
        }
        
        itemEl.addEventListener('click', () => {
            outlineGenerator.toggleSemanticElementSelection(`${prefix}_${index}`);
            toggleSemanticElementDisplay(itemEl);
            updateStatistics();
        });
        
        itemsContainer.appendChild(itemEl);
    });
    
    sectionDiv.appendChild(titleEl);
    sectionDiv.appendChild(itemsContainer);
    container.appendChild(sectionDiv);
}

function renderSemanticCategory(categoryName, category, container) {
    if (!category || !category.entities) return;
    
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'semantic-category mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg';
    
    const titleEl = document.createElement('h4');
    titleEl.className = 'font-semibold text-gray-900 dark:text-white mb-3';
    titleEl.textContent = `Categoria: ${categoryName}`;
    
    categoryDiv.appendChild(titleEl);
    
    // Render entities
    renderSemanticSection('Entità', category.entities, `category_${categoryName}_entity`, categoryDiv);
    
    // Render examples if available
    if (category.examples) {
        renderSemanticSection('Esempi', category.examples, `category_${categoryName}_example`, categoryDiv);
    }
    
    // Render attributes if available
    if (category.attributes) {
        renderSemanticSection('Attributi', category.attributes, `category_${categoryName}_attribute`, categoryDiv);
    }
    
    container.appendChild(categoryDiv);
}

function renderAspectsToTreat(aspectsToTreat) {
    const aspectsSection = document.getElementById('aspectsSection');
    const aspectsList = document.getElementById('aspectsList');
    
    if (!aspectsSection || !aspectsList || !aspectsToTreat) return;
    
    aspectsList.innerHTML = '';
    
    if (aspectsToTreat.aspectsByCategory) {
        Object.keys(aspectsToTreat.aspectsByCategory).forEach(categoryKey => {
            const categoryAspects = aspectsToTreat.aspectsByCategory[categoryKey];
            
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'aspects-category mb-6';
            
            const categoryTitle = document.createElement('h4');
            categoryTitle.className = 'font-semibold text-gray-900 dark:text-white mb-3';
            categoryTitle.textContent = categoryKey;
            
            categoryDiv.appendChild(categoryTitle);
            
            categoryAspects.forEach((aspect, index) => {
                const aspectDiv = document.createElement('div');
                aspectDiv.className = 'aspect-item flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg mb-2';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `aspect-${categoryKey}-${index}`;
                checkbox.checked = outlineGenerator.results.selectedElements.aspects.has(`${categoryKey}_${index}`);
                checkbox.className = 'mt-1';
                checkbox.addEventListener('change', () => {
                    outlineGenerator.toggleAspectSelection(`${categoryKey}_${index}`);
                    updateStatistics();
                });
                
                const contentDiv = document.createElement('div');
                contentDiv.className = 'flex-1';
                
                const aspectTitle = document.createElement('h5');
                aspectTitle.className = 'font-medium text-gray-900 dark:text-white';
                aspectTitle.textContent = aspect.aspect;
                
                const aspectDescription = document.createElement('p');
                aspectDescription.className = 'text-sm text-gray-600 dark:text-gray-400 mt-1';
                aspectDescription.textContent = aspect.description;
                
                const aspectMeta = document.createElement('div');
                aspectMeta.className = 'flex items-center space-x-4 mt-2';
                
                const priorityBadge = document.createElement('span');
                priorityBadge.className = `px-2 py-1 text-xs rounded-full ${getPriorityClass(aspect.priority)}`;
                priorityBadge.textContent = aspect.priority;
                
                aspectMeta.appendChild(priorityBadge);
                
                if (aspect.foundInCompetitors && aspect.foundInCompetitors.length > 0) {
                    const competitorsBadge = document.createElement('span');
                    competitorsBadge.className = 'text-xs text-gray-500 dark:text-gray-400';
                    competitorsBadge.textContent = `Trovato in ${aspect.foundInCompetitors.length} competitor`;
                    aspectMeta.appendChild(competitorsBadge);
                }
                
                contentDiv.appendChild(aspectTitle);
                contentDiv.appendChild(aspectDescription);
                contentDiv.appendChild(aspectMeta);
                
                aspectDiv.appendChild(checkbox);
                aspectDiv.appendChild(contentDiv);
                categoryDiv.appendChild(aspectDiv);
            });
            
            aspectsList.appendChild(categoryDiv);
        });
    }
}

function getPriorityClass(priority) {
    const classes = {
        'high': 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
        'medium': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
        'low': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
    };
    
    return classes[priority] || classes.medium;
}

function toggleSemanticElementDisplay(element) {
    if (element.classList.contains('selected')) {
        // Deselect
        element.classList.remove('selected');
        element.classList.remove('bg-green-100', 'dark:bg-green-900', 'text-green-800', 'dark:text-green-200');
        element.classList.add('bg-blue-100', 'dark:bg-blue-900', 'text-blue-800', 'dark:text-blue-200');
    } else {
        // Select
        element.classList.add('selected');
        element.classList.add('bg-green-100', 'dark:bg-green-900', 'text-green-800', 'dark:text-green-200');
        element.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'text-blue-800', 'dark:text-blue-200');
    }
}

function updateStatistics() {
    const stats = outlineGenerator.getStatistics();
    
    // Update competitor count
    const competitorCount = document.getElementById('competitorCount');
    if (competitorCount) {
        competitorCount.textContent = `${stats.selectedCompetitorCount}/${stats.competitorCount}`;
    }
    
    // Update semantic count
    const semanticCount = document.getElementById('semanticCount');
    if (semanticCount) {
        semanticCount.textContent = `${stats.selectedSemanticElements}/${stats.totalSemanticElements}`;
    }
    
    // Update aspects count
    const aspectCount = document.getElementById('aspectCount');
    if (aspectCount) {
        aspectCount.textContent = `${stats.selectedAspects}/${stats.totalAspects}`;
    }
    
    // Show/hide stats card
    const statsCard = document.getElementById('statsCard');
    if (statsCard && stats.competitorCount > 0) {
        statsCard.classList.remove('hidden');
    }
    
    // Enable/disable proceed button
    const proceedBtn = document.getElementById('proceedBtn');
    if (proceedBtn) {
        const hasSelections = stats.selectedCompetitorCount > 0 || stats.selectedSemanticElements > 0 || stats.selectedAspects > 0;
        proceedBtn.disabled = !hasSelections;
    }
}

export function setupSelectionControls() {
    const selectAllBtn = document.getElementById('selectAllBtn');
    const deselectAllBtn = document.getElementById('deselectAllBtn');
    const proceedBtn = document.getElementById('proceedBtn');
    
    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', () => {
            outlineGenerator.selectAllElements();
            renderResults(outlineGenerator.results);
        });
    }
    
    if (deselectAllBtn) {
        deselectAllBtn.addEventListener('click', () => {
            outlineGenerator.deselectAllElements();
            renderResults(outlineGenerator.results);
        });
    }
    
    if (proceedBtn) {
        proceedBtn.addEventListener('click', () => {
            showPhase2();
        });
    }
}

function showPhase2() {
    const selectedData = outlineGenerator.getSelectedData();
    
    // Show Phase 2 section
    const phase2Section = document.getElementById('phase2Section');
    if (phase2Section) {
        phase2Section.classList.remove('hidden');
        fadeIn(phase2Section);
        
        // Scroll to Phase 2
        phase2Section.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Update selected summary
    updateSelectedSummary(selectedData);
    
    // Setup Phase 2 event listeners
    setupPhase2EventListeners();
}

function updateSelectedSummary(selectedData) {
    const selectedSummary = document.getElementById('selectedSummary');
    if (!selectedSummary) return;
    
    selectedSummary.innerHTML = `
        <div>• <strong>Competitor:</strong> ${selectedData.counts.competitors} selezionati</div>
        <div>• <strong>Elementi Semantici:</strong> ${selectedData.counts.semanticElements} selezionati</div>
        <div>• <strong>Aspetti da Trattare:</strong> ${selectedData.counts.aspects} selezionati</div>
    `;
}

function setupPhase2EventListeners() {
    const generateOutlineBtn = document.getElementById('generateOutlineBtn');
    const copyMarkdownBtn = document.getElementById('copyMarkdownBtn');
    
    if (generateOutlineBtn) {
        generateOutlineBtn.addEventListener('click', async () => {
            await handleGenerateOutline();
        });
    }
    
    if (copyMarkdownBtn) {
        copyMarkdownBtn.addEventListener('click', () => {
            copyOutlineToClipboard();
        });
    }
}

async function handleGenerateOutline() {
    try {
        const openrouterApiKey = document.getElementById('openrouterApiKey').value.trim();
        const topic = document.getElementById('topicInput').value.trim();
        const includeH3 = document.getElementById('includeH3').checked;
        
        if (!openrouterApiKey || !topic) {
            showError('API key e topic sono richiesti per generare l\'outline.');
            return;
        }
        
        showLoading('Generando outline finale...');
        
        const result = await outlineGenerator.generateFinalOutline(openrouterApiKey, topic, includeH3);
        
        // Display the generated outline
        displayGeneratedOutline(result.outline, result.analytics);
        
        hideLoading();
        showSuccess('Outline finale generata con successo!');
        
    } catch (error) {
        hideLoading();
        showError(`Errore durante la generazione: ${error.message}`);
        console.error('Outline generation error:', error);
    }
}

function displayGeneratedOutline(outline, analytics) {
    const generatedOutlineSection = document.getElementById('generatedOutlineSection');
    const generatedOutlineContent = document.getElementById('generatedOutlineContent');
    
    if (generatedOutlineSection && generatedOutlineContent) {
        generatedOutlineContent.textContent = outline;
        generatedOutlineSection.classList.remove('hidden');
        fadeIn(generatedOutlineSection);
        
        // Update analytics
        updateOutlineAnalytics(analytics);
        
        // Add Phase 3 button if not already present
        addPhase3Button(generatedOutlineSection, outline);
        
        // Scroll to generated outline
        generatedOutlineSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function addPhase3Button(section, outline) {
    // Check if button already exists
    let phase3Btn = section.querySelector('#proceedToPhase3Btn');
    
    if (!phase3Btn) {
        // Create Phase 3 button
        const btnContainer = document.createElement('div');
        btnContainer.className = 'mt-4 text-center';
        
        phase3Btn = document.createElement('button');
        phase3Btn.id = 'proceedToPhase3Btn';
        phase3Btn.className = 'bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-md transition-colors text-lg';
        phase3Btn.innerHTML = '🧠 Procedi alla Fase 3: Analisi Semantica';
        
        btnContainer.appendChild(phase3Btn);
        section.appendChild(btnContainer);
    }
    
    // Update event listener
    phase3Btn.onclick = () => {
        const topic = document.getElementById('topicInput').value.trim();
        showPhase3(outline, topic);
    };
}

function updateOutlineAnalytics(analytics) {
    const elements = {
        h2Count: document.getElementById('h2Count'),
        h3Count: document.getElementById('h3Count'),
        questionsCount: document.getElementById('questionsCount'),
        totalSections: document.getElementById('totalSections')
    };
    
    if (elements.h2Count) elements.h2Count.textContent = analytics.h2Count;
    if (elements.h3Count) elements.h3Count.textContent = analytics.h3Count;
    if (elements.questionsCount) elements.questionsCount.textContent = analytics.questionsCount;
    if (elements.totalSections) elements.totalSections.textContent = analytics.totalSections;
}

function copyOutlineToClipboard() {
    const generatedOutlineContent = document.getElementById('generatedOutlineContent');
    if (!generatedOutlineContent || !generatedOutlineContent.textContent) {
        showError('Nessuna outline da copiare.');
        return;
    }
    
    const outlineText = generatedOutlineContent.textContent;
    const markdownText = outlineGenerator.convertToMarkdown(outlineText);
    
    navigator.clipboard.writeText(markdownText).then(() => {
        showSuccess('Outline copiata in formato Markdown!');
        
        // Visual feedback on button
        const copyBtn = document.getElementById('copyMarkdownBtn');
        if (copyBtn) {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '✅ Copiato!';
            copyBtn.classList.add('bg-green-600');
            copyBtn.classList.remove('bg-blue-600');
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.classList.remove('bg-green-600');
                copyBtn.classList.add('bg-blue-600');
            }, 2000);
        }
    }).catch(err => {
        console.error('Error copying to clipboard:', err);
        showError('Errore durante la copia negli appunti.');
    });
}