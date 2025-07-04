import { 
    searchCompetitorUrls, 
    extractOutlineFromContent,
    generateSemanticAnalysis,
    generateAspectsToTreat
} from '../api/openrouter.js';

export class OutlineGenerator {
    constructor() {
        this.results = {
            competitorUrls: [],
            competitorOutlines: [],
            semanticAnalysis: null,
            aspectsToTreat: null,
            selectedElements: {
                competitors: new Set(),
                semanticElements: new Set(),
                aspects: new Set()
            }
        };
        
        this.progressCallback = null;
        this.statusCallback = null;
    }

    setProgressCallback(callback) {
        this.progressCallback = callback;
    }

    setStatusCallback(callback) {
        this.statusCallback = callback;
    }

    updateProgress(step, message) {
        if (this.progressCallback) {
            this.progressCallback(step, message);
        }
    }

    updateStatus(message) {
        if (this.statusCallback) {
            this.statusCallback(message);
        }
    }

    async generateCompleteOutline(apiKey, topic) {
        try {
            this.updateStatus('Iniziando la generazione...');
            
            // Step 1: Search competitor URLs
            this.updateProgress(1, 'Ricerca competitor nella SERP');
            this.updateStatus('Cercando competitor nella SERP...');
            
            this.results.competitorUrls = await searchCompetitorUrls(apiKey, topic);
            
            // Step 2: Extract outlines from competitors
            this.updateProgress(2, 'Estrazione outline competitor');
            this.updateStatus('Estraendo outline dai competitor...');
            
            this.results.competitorOutlines = [];
            for (let i = 0; i < Math.min(this.results.competitorUrls.length, 10); i++) {
                const competitor = this.results.competitorUrls[i];
                try {
                    const outline = await extractOutlineFromContent(
                        apiKey, 
                        competitor.url, 
                        competitor.title, 
                        competitor.description
                    );
                    this.results.competitorOutlines.push(outline);
                    this.results.selectedElements.competitors.add(i);
                } catch (error) {
                    console.warn(`Failed to extract outline from ${competitor.url}:`, error);
                }
            }

            // Step 3: Generate semantic analysis
            this.updateProgress(3, 'Analisi semantica completa');
            this.updateStatus('Generando analisi semantica completa...');
            
            this.results.semanticAnalysis = await generateSemanticAnalysis(apiKey, topic);
            this.selectAllSemanticElements();

            // Step 4: Generate aspects to treat
            this.updateProgress(4, 'Generazione aspetti da trattare');
            this.updateStatus('Identificando aspetti da trattare...');
            
            this.results.aspectsToTreat = await generateAspectsToTreat(
                apiKey, 
                topic, 
                this.results.competitorOutlines
            );
            this.selectAllAspects();

            // Step 5: Complete
            this.updateProgress(5, 'Compilazione risultati completata');
            this.updateStatus('Generazione completata con successo!');

            return this.results;

        } catch (error) {
            this.updateStatus(`Errore durante la generazione: ${error.message}`);
            throw error;
        }
    }

    selectAllSemanticElements() {
        this.results.selectedElements.semanticElements.clear();
        
        if (this.results.semanticAnalysis) {
            // Add salient entities
            this.results.semanticAnalysis.salientEntities?.forEach((entity, index) => {
                this.results.selectedElements.semanticElements.add(`salient_${index}`);
            });

            // Add synonyms
            this.results.semanticAnalysis.synonyms?.forEach((synonym, index) => {
                this.results.selectedElements.semanticElements.add(`synonym_${index}`);
            });

            // Add categories and their entities
            Object.keys(this.results.semanticAnalysis.categories || {}).forEach(categoryKey => {
                this.results.selectedElements.semanticElements.add(`category_${categoryKey}`);
                
                const category = this.results.semanticAnalysis.categories[categoryKey];
                category.entities?.forEach((entity, index) => {
                    this.results.selectedElements.semanticElements.add(`category_${categoryKey}_entity_${index}`);
                });
            });

            // Add other elements
            ['partWholeRelationships', 'commonCollocations', 'relatedStatements', 
             'relatedQuestions', 'commonErrors', 'currentDebates'].forEach(key => {
                this.results.semanticAnalysis[key]?.forEach((item, index) => {
                    this.results.selectedElements.semanticElements.add(`${key}_${index}`);
                });
            });
        }
    }

    selectAllAspects() {
        this.results.selectedElements.aspects.clear();
        
        if (this.results.aspectsToTreat?.aspectsByCategory) {
            Object.keys(this.results.aspectsToTreat.aspectsByCategory).forEach(categoryKey => {
                const aspects = this.results.aspectsToTreat.aspectsByCategory[categoryKey];
                aspects.forEach((aspect, index) => {
                    this.results.selectedElements.aspects.add(`${categoryKey}_${index}`);
                });
            });
        }
    }

    deselectAllElements() {
        this.results.selectedElements.competitors.clear();
        this.results.selectedElements.semanticElements.clear();
        this.results.selectedElements.aspects.clear();
    }

    selectAllElements() {
        // Select all competitors
        this.results.competitorOutlines.forEach((_, index) => {
            this.results.selectedElements.competitors.add(index);
        });

        this.selectAllSemanticElements();
        this.selectAllAspects();
    }

    toggleCompetitorSelection(index) {
        if (this.results.selectedElements.competitors.has(index)) {
            this.results.selectedElements.competitors.delete(index);
        } else {
            this.results.selectedElements.competitors.add(index);
        }
    }

    toggleSemanticElementSelection(elementId) {
        if (this.results.selectedElements.semanticElements.has(elementId)) {
            this.results.selectedElements.semanticElements.delete(elementId);
        } else {
            this.results.selectedElements.semanticElements.add(elementId);
        }
    }

    toggleAspectSelection(aspectId) {
        if (this.results.selectedElements.aspects.has(aspectId)) {
            this.results.selectedElements.aspects.delete(aspectId);
        } else {
            this.results.selectedElements.aspects.add(aspectId);
        }
    }

    getSelectedData() {
        const selectedCompetitors = this.results.competitorOutlines.filter((_, index) => 
            this.results.selectedElements.competitors.has(index)
        );

        const selectedSemanticData = this.extractSelectedSemanticData();
        const selectedAspects = this.extractSelectedAspects();

        return {
            competitors: selectedCompetitors,
            semanticAnalysis: selectedSemanticData,
            aspects: selectedAspects,
            counts: {
                competitors: selectedCompetitors.length,
                semanticElements: this.results.selectedElements.semanticElements.size,
                aspects: this.results.selectedElements.aspects.size
            }
        };
    }

    extractSelectedSemanticData() {
        if (!this.results.semanticAnalysis) return null;

        const selected = {};
        
        // Extract selected salient entities
        const selectedSalientEntities = [];
        this.results.semanticAnalysis.salientEntities?.forEach((entity, index) => {
            if (this.results.selectedElements.semanticElements.has(`salient_${index}`)) {
                selectedSalientEntities.push(entity);
            }
        });
        if (selectedSalientEntities.length > 0) {
            selected.salientEntities = selectedSalientEntities;
        }

        // Extract selected synonyms
        const selectedSynonyms = [];
        this.results.semanticAnalysis.synonyms?.forEach((synonym, index) => {
            if (this.results.selectedElements.semanticElements.has(`synonym_${index}`)) {
                selectedSynonyms.push(synonym);
            }
        });
        if (selectedSynonyms.length > 0) {
            selected.synonyms = selectedSynonyms;
        }

        // Continue for other elements...
        return selected;
    }

    extractSelectedAspects() {
        if (!this.results.aspectsToTreat?.aspectsByCategory) return null;

        const selected = {};
        
        Object.keys(this.results.aspectsToTreat.aspectsByCategory).forEach(categoryKey => {
            const aspects = this.results.aspectsToTreat.aspectsByCategory[categoryKey];
            const selectedAspects = [];
            
            aspects.forEach((aspect, index) => {
                if (this.results.selectedElements.aspects.has(`${categoryKey}_${index}`)) {
                    selectedAspects.push(aspect);
                }
            });
            
            if (selectedAspects.length > 0) {
                selected[categoryKey] = selectedAspects;
            }
        });

        return selected;
    }

    getStatistics() {
        return {
            competitorCount: this.results.competitorOutlines.length,
            selectedCompetitorCount: this.results.selectedElements.competitors.size,
            totalSemanticElements: this.calculateTotalSemanticElements(),
            selectedSemanticElements: this.results.selectedElements.semanticElements.size,
            totalAspects: this.calculateTotalAspects(),
            selectedAspects: this.results.selectedElements.aspects.size
        };
    }

    calculateTotalSemanticElements() {
        if (!this.results.semanticAnalysis) return 0;

        let count = 0;
        count += this.results.semanticAnalysis.salientEntities?.length || 0;
        count += this.results.semanticAnalysis.synonyms?.length || 0;
        
        // Count category entities
        Object.values(this.results.semanticAnalysis.categories || {}).forEach(category => {
            count += category.entities?.length || 0;
        });

        ['partWholeRelationships', 'commonCollocations', 'relatedStatements', 
         'relatedQuestions', 'commonErrors', 'currentDebates'].forEach(key => {
            count += this.results.semanticAnalysis[key]?.length || 0;
        });

        return count;
    }

    calculateTotalAspects() {
        if (!this.results.aspectsToTreat?.aspectsByCategory) return 0;

        let count = 0;
        Object.values(this.results.aspectsToTreat.aspectsByCategory).forEach(aspects => {
            count += aspects.length;
        });

        return count;
    }
}

// Singleton instance
export const outlineGenerator = new OutlineGenerator();